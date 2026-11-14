-- ====================================================================
-- SUPLEMENTOS TOP - MIGRACIÓN INICIAL DE BASE DE DATOS POSTGRESQL
-- Arquitectura transaccional segura, normalizada y escalable
-- Todos los importes monetarios se manejan como INTEGER en CENTAVOS.
-- ====================================================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'refunded', 'cancelled');
CREATE TYPE fulfillment_status AS ENUM ('unfulfilled', 'preparing', 'ready_for_pickup', 'shipped', 'delivered', 'cancelled');
CREATE TYPE delivery_method AS ENUM ('shipping', 'pickup');
CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
CREATE TYPE movement_type AS ENUM ('initial', 'restock', 'adjustment', 'reservation', 'sale', 'cancellation_refund');

-- 2. TABLA: profiles (Vinculada a auth.users de Supabase)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    dni TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA: store_settings (Configuración del negocio)
CREATE TABLE store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'Suplementos Top',
    legal_name TEXT NOT NULL DEFAULT 'Suplementos Top Argentina',
    support_phone TEXT NOT NULL DEFAULT '+54 9 11 6565-1990',
    support_email TEXT NOT NULL DEFAULT 'suplementostopparg@gmail.com',
    instagram TEXT NOT NULL DEFAULT 'https://instagram.com/suplementos_topp',
    hours_description TEXT NOT NULL DEFAULT 'Lunes a Viernes de 8:00 a 23:00 hs | Sábados de 10:00 a 18:00 hs',
    pickup_address TEXT NOT NULL DEFAULT 'Uriburu 1163, entre Santa Fe y Arenales, CABA',
    dispatch_address TEXT NOT NULL DEFAULT 'Uriburu 1163, Recoleta, CABA',
    free_shipping_threshold_in_cents BIGINT NOT NULL DEFAULT 8500000, -- $85.000 ARS
    flat_shipping_rate_in_cents BIGINT NOT NULL DEFAULT 490000,       -- $4.900 ARS
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABLA: products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'Top Performance Lab',
    status product_status NOT NULL DEFAULT 'published',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    serving_info TEXT,
    nutritional_highlights TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABLA: product_images
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABLA: product_variants
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    flavor TEXT,
    size TEXT,
    price_in_cents BIGINT NOT NULL CHECK (price_in_cents >= 0),
    compare_at_price_in_cents BIGINT CHECK (compare_at_price_in_cents >= 0),
    weight_grams INT DEFAULT 1000,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABLA: inventory (Existencias físicas y reservadas)
CREATE TABLE inventory (
    variant_id UUID PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
    on_hand INT NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
    reserved INT NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT available_stock_check CHECK (on_hand >= reserved)
);

-- 9. TABLA: stock_reservations (Reservas temporales con TTL de 15 minutos en checkout)
CREATE TABLE stock_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    expires_at TIMESTAMPTZ NOT NULL,
    is_released BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TABLA: stock_movements (Libro contable inmutable de inventario)
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    movement_type movement_type NOT NULL,
    quantity_change INT NOT NULL,
    balance_after INT NOT NULL,
    reference_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TABLA: orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_dni TEXT NOT NULL,
    delivery_method delivery_method NOT NULL DEFAULT 'shipping',
    
    -- Dirección de envío (snapshot)
    shipping_street TEXT,
    shipping_number TEXT,
    shipping_apartment TEXT,
    shipping_neighborhood TEXT,
    shipping_city TEXT,
    shipping_province TEXT,
    shipping_postal_code TEXT,
    shipping_notes TEXT,
    
    -- Totales en centavos
    subtotal_in_cents BIGINT NOT NULL CHECK (subtotal_in_cents >= 0),
    shipping_fee_in_cents BIGINT NOT NULL DEFAULT 0 CHECK (shipping_fee_in_cents >= 0),
    discount_in_cents BIGINT NOT NULL DEFAULT 0 CHECK (discount_in_cents >= 0),
    total_in_cents BIGINT NOT NULL CHECK (total_in_cents >= 0),

    -- Estados desacoplados
    payment_status payment_status NOT NULL DEFAULT 'pending',
    fulfillment_status fulfillment_status NOT NULL DEFAULT 'unfulfilled',

    -- Datos de pasarela y logística
    payment_method TEXT,
    mercadopago_preference_id TEXT,
    mercadopago_payment_id TEXT,
    shipping_carrier TEXT,
    tracking_number TEXT,
    dispatched_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. TABLA: order_items (Instantánea inmutable del producto comprado)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    variant_title TEXT NOT NULL,
    sku TEXT NOT NULL,
    unit_price_in_cents BIGINT NOT NULL CHECK (unit_price_in_cents >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_in_cents BIGINT NOT NULL CHECK (total_price_in_cents >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. TABLA: payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'mercadopago',
    external_payment_id TEXT UNIQUE,
    status payment_status NOT NULL DEFAULT 'pending',
    amount_in_cents BIGINT NOT NULL,
    net_received_amount_in_cents BIGINT,
    fee_in_cents BIGINT,
    currency TEXT NOT NULL DEFAULT 'ARS',
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. TABLA: payment_events (Idempotencia estricta para webhooks)
CREATE TABLE payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL DEFAULT 'mercadopago',
    event_id TEXT NOT NULL UNIQUE,
    action TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. TABLA: notifications_log (Emails Resend y avisos WhatsApp)
CREATE TABLE notifications_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- 'email' o 'whatsapp'
    recipient TEXT NOT NULL,
    template_type TEXT NOT NULL, -- 'order_confirmation', 'owner_dispatch_alert', etc.
    status TEXT NOT NULL DEFAULT 'pending', -- 'sent', 'failed'
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ÍNDICES PARA RENDIMIENTO ÓPTIMO
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX idx_stock_reservations_expires ON stock_reservations(expires_at) WHERE is_released = FALSE;
