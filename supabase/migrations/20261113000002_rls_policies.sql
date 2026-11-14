-- ====================================================================
-- SUPLEMENTOS TOP - POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- Protección rigurosa de datos comerciales, pedidos y credenciales.
-- ====================================================================

-- 1. Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- 2. FUNCIÓN DE SEGURIDAD: Verificar si el usuario autenticado es Administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. POLÍTICAS: store_settings
-- Cualquier visitante puede leer la configuración pública de la tienda
CREATE POLICY "store_settings_public_read" ON store_settings
    FOR SELECT USING (true);

-- Solo administradores pueden modificar los datos del negocio
CREATE POLICY "store_settings_admin_write" ON store_settings
    FOR ALL USING (is_admin());

-- 4. POLÍTICAS: categories
CREATE POLICY "categories_public_read" ON categories
    FOR SELECT USING (true);

CREATE POLICY "categories_admin_all" ON categories
    FOR ALL USING (is_admin());

-- 5. POLÍTICAS: products
-- Visitantes solo ven productos con status 'published'
CREATE POLICY "products_public_read" ON products
    FOR SELECT USING (status = 'published' OR is_admin());

CREATE POLICY "products_admin_all" ON products
    FOR ALL USING (is_admin());

-- 6. POLÍTICAS: product_images y product_variants
CREATE POLICY "product_images_public_read" ON product_images
    FOR SELECT USING (true);

CREATE POLICY "product_images_admin_all" ON product_images
    FOR ALL USING (is_admin());

CREATE POLICY "product_variants_public_read" ON product_variants
    FOR SELECT USING (true);

CREATE POLICY "product_variants_admin_all" ON product_variants
    FOR ALL USING (is_admin());

-- 7. POLÍTICAS: inventory
-- Público solo puede ver existencias; modificación reservada a funciones y admins
CREATE POLICY "inventory_public_read" ON inventory
    FOR SELECT USING (true);

CREATE POLICY "inventory_admin_all" ON inventory
    FOR ALL USING (is_admin());

-- 8. POLÍTICAS: orders & order_items
-- El comprador autenticado solo ve sus propios pedidos
CREATE POLICY "orders_customer_select" ON orders
    FOR SELECT USING (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR is_admin()
    );

-- El público puede crear pedidos durante el checkout
CREATE POLICY "orders_public_insert" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_admin_all" ON orders
    FOR ALL USING (is_admin());

CREATE POLICY "order_items_select" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND ((auth.uid() IS NOT NULL AND orders.customer_id = auth.uid()) OR is_admin())
        )
    );

CREATE POLICY "order_items_insert" ON order_items
    FOR INSERT WITH CHECK (true);

-- 9. POLÍTICAS: payments, payment_events & notifications
-- Solo accesibles por funciones de backend autenticadas con service_role o por admins
CREATE POLICY "payments_admin_all" ON payments
    FOR ALL USING (is_admin());

CREATE POLICY "payment_events_admin_all" ON payment_events
    FOR ALL USING (is_admin());

CREATE POLICY "notifications_log_admin_all" ON notifications_log
    FOR ALL USING (is_admin());

CREATE POLICY "stock_movements_admin_all" ON stock_movements
    FOR ALL USING (is_admin());
