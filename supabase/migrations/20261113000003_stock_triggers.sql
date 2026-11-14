-- ====================================================================
-- SUPLEMENTOS TOP - PROCEDIMIENTOS TRANSACCIONALES DE STOCK
-- Prevención estricta de sobreventas, reservas con TTL y confirmación de pago
-- ====================================================================

-- 1. FUNCIÓN: Reservar stock temporalmente para un checkout (TTL 15 minutos)
CREATE OR REPLACE FUNCTION reserve_stock_for_checkout(
    p_order_id UUID,
    p_variant_id UUID,
    p_quantity INT,
    p_ttl_minutes INT DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
    v_on_hand INT;
    v_reserved INT;
    v_available INT;
BEGIN
    -- Bloqueo pesimista de fila para evitar condiciones de carrera (Race Conditions)
    SELECT on_hand, reserved INTO v_on_hand, v_reserved
    FROM inventory
    WHERE variant_id = p_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La variante de producto % no existe en inventario', p_variant_id;
    END IF;

    v_available := v_on_hand - v_reserved;

    IF v_available < p_quantity THEN
        RETURN FALSE; -- Stock insuficiente para la reserva
    END IF;

    -- Incrementar stock reservado
    UPDATE inventory
    SET reserved = reserved + p_quantity,
        updated_at = NOW()
    WHERE variant_id = p_variant_id;

    -- Insertar registro de reserva con timestamp de expiración
    INSERT INTO stock_reservations (
        order_id,
        variant_id,
        quantity,
        expires_at
    ) VALUES (
        p_order_id,
        p_variant_id,
        p_quantity,
        NOW() + (p_ttl_minutes || ' minutes')::INTERVAL
    );

    -- Registrar movimiento contable
    INSERT INTO stock_movements (
        variant_id,
        movement_type,
        quantity_change,
        balance_after,
        reference_id,
        notes
    ) VALUES (
        p_variant_id,
        'reservation',
        -p_quantity,
        v_available - p_quantity,
        p_order_id::TEXT,
        'Reserva temporal checkout'
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. FUNCIÓN: Liberar reservas expiradas (Ejecutable periódicamente por Cron o Edge Function)
CREATE OR REPLACE FUNCTION release_expired_stock_reservations()
RETURNS INT AS $$
DECLARE
    r RECORD;
    v_released_count INT := 0;
BEGIN
    FOR r IN
        SELECT id, variant_id, quantity
        FROM stock_reservations
        WHERE expires_at < NOW()
          AND is_released = FALSE
        FOR UPDATE
    LOOP
        -- Devolver la cantidad al stock disponible disminuyendo 'reserved'
        UPDATE inventory
        SET reserved = GREATEST(0, reserved - r.quantity),
            updated_at = NOW()
        WHERE variant_id = r.variant_id;

        -- Marcar reserva como liberada
        UPDATE stock_reservations
        SET is_released = TRUE
        WHERE id = r.id;

        -- Registrar movimiento contable de devolución
        INSERT INTO stock_movements (
            variant_id,
            movement_type,
            quantity_change,
            balance_after,
            reference_id,
            notes
        ) 
        SELECT 
            r.variant_id,
            'adjustment',
            r.quantity,
            (on_hand - reserved),
            r.id::TEXT,
            'Expiración de reserva no concretada'
        FROM inventory
        WHERE variant_id = r.variant_id;

        v_released_count := v_released_count + 1;
    END LOOP;

    RETURN v_released_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. FUNCIÓN: Confirmar venta y descontar stock físico tras aprobación de Mercado Pago
CREATE OR REPLACE FUNCTION confirm_order_stock_payment(
    p_order_id UUID
)
RETURNS VOID AS $$
DECLARE
    r RECORD;
BEGIN
    -- Recorrer los items de la orden
    FOR r IN
        SELECT variant_id, quantity
        FROM order_items
        WHERE order_id = p_order_id
    LOOP
        -- Descontar del stock físico real (on_hand) y limpiar la reserva (reserved)
        UPDATE inventory
        SET on_hand = GREATEST(0, on_hand - r.quantity),
            reserved = GREATEST(0, reserved - r.quantity),
            updated_at = NOW()
        WHERE variant_id = r.variant_id;

        -- Registrar salida definitiva por venta
        INSERT INTO stock_movements (
            variant_id,
            movement_type,
            quantity_change,
            balance_after,
            reference_id,
            notes
        )
        SELECT 
            r.variant_id,
            'sale',
            -r.quantity,
            on_hand,
            p_order_id::TEXT,
            'Venta confirmada por Mercado Pago'
        FROM inventory
        WHERE variant_id = r.variant_id;
    END LOOP;

    -- Marcar reservas asociadas como procesadas/liberadas
    UPDATE stock_reservations
    SET is_released = TRUE
    WHERE order_id = p_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
