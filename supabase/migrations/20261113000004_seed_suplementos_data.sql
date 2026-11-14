-- ====================================================================
-- SUPLEMENTOS TOP - SEED DATA INICIAL
-- Configuración comercial, categorías, suplementos reales y existencias
-- ====================================================================

-- 1. Insertar configuración comercial oficial
INSERT INTO store_settings (
    store_name,
    legal_name,
    support_phone,
    support_email,
    instagram,
    hours_description,
    pickup_address,
    dispatch_address,
    free_shipping_threshold_in_cents,
    flat_shipping_rate_in_cents
) VALUES (
    'Suplementos Top',
    'Suplementos Top Argentina',
    '+54 9 11 6565-1990',
    'suplementostopparg@gmail.com',
    'https://instagram.com/suplementos_topp',
    'Lunes a Viernes de 8:00 a 23:00 hs | Sábados de 10:00 a 18:00 hs',
    'Uriburu 1163, entre Santa Fe y Arenales, CABA',
    'Uriburu 1163, Recoleta, CABA',
    8500000, -- $85.000 ARS
    490000   -- $4.900 ARS
) ON CONFLICT DO NOTHING;

-- 2. Insertar categorías
INSERT INTO categories (id, name, slug, description, image_url, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Proteínas', 'proteinas', 'Whey Protein concentradas, aisladas e hidrolizadas para máxima recuperación.', 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80', 1),
('22222222-2222-2222-2222-222222222222', 'Creatinas', 'creatinas', 'Creatina monohidratada micronizada y sello Creapure® para fuerza y potencia.', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80', 2),
('33333333-3333-3333-3333-333333333333', 'Pre-Entrenos', 'pre-entrenos', 'Fórmulas energéticas con cafeína, beta-alanina y citrulina para bombeo y enfoque.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80', 3),
('44444444-4444-4444-4444-444444444444', 'Aminoácidos & BCAA', 'aminoacidos', 'BCAA 2:1:1, EAA y Glutamina para acelerar la síntesis proteica.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80', 4),
('55555555-5555-5555-5555-555555555555', 'Salud & Vitaminas', 'salud-vitaminas', 'Multivitamínicos de alto rendimiento, Omega 3, Magnesio y Colágeno.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', 5),
('66666666-6666-6666-6666-666666666666', 'Shakers & Accesorios', 'accesorios', 'Botellas mezcladoras herméticas, correas y toallas de entrenamiento.', 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=600&q=80', 6)
ON CONFLICT DO NOTHING;

-- 3. Insertar Productos y Variantes
-- Producto 1: 100% Whey Isolate Ultra-Pure
INSERT INTO products (id, category_id, name, slug, tagline, description, brand, is_featured, is_best_seller, rating, review_count, serving_info, nutritional_highlights) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '100% Whey Isolate Ultra-Pure', '100-whey-isolate-ultra-pure', '27g de proteína aislada por porción, 0g azúcar, ultra absorción', 'Nuestra fórmula estrella de aislado de suero lácteo microfiltrado por flujo cruzado (CFM). Diseñada para atletas exigentes que buscan máxima ganancia magra sin carbohidratos añadidos ni lactosa.', 'Top Performance Lab', true, true, 4.90, 142, '30 porciones por envase (Scoop 32g)', ARRAY['27g Proteína pura', '5.8g BCAA naturales', 'Sin gluten / Libre de TACC', 'Digestión ultrarrápida'])
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80', '100% Whey Isolate Ultra-Pure frente', 1);

INSERT INTO product_variants (id, product_id, sku, title, flavor, size, price_in_cents, compare_at_price_in_cents, weight_grams, is_default) VALUES
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TOP-WHEY-CHO-1', 'Chocolate Belga - 1kg (30 serv.)', 'Chocolate Belga', '1kg', 4890000, 5690000, 1000, true),
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TOP-WHEY-VAN-1', 'Vainilla Francesa - 1kg (30 serv.)', 'Vainilla Francesa', '1kg', 4890000, 5690000, 1000, false),
('daaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TOP-WHEY-CHO-2', 'Chocolate Belga - 2kg (60 serv.)', 'Chocolate Belga', '2kg', 8990000, 10500000, 2000, false);

-- Inventario de Producto 1
INSERT INTO inventory (variant_id, on_hand, reserved) VALUES
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 35, 0),
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 22, 0),
('daaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 14, 0)
ON CONFLICT DO NOTHING;

-- Producto 2: Creatina Creapure® Monohidrato
INSERT INTO products (id, category_id, name, slug, tagline, description, brand, is_featured, is_best_seller, rating, review_count, serving_info, nutritional_highlights) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Creatina Creapure® Monohidrato 100% Pura', 'creatina-creapure-monohidrato-100-pura', 'Fuerza explosiva, potencia muscular y sello alemán de máxima pureza', 'La creatina más estudiada y certificada del mundo. Materia prima Creapure® fabricada en Alemania bajo estándares farmacéuticos. Cero impurezas, solubilidad total.', 'Creapure Germany / Suplementos Top', true, true, 5.00, 231, '60 a 100 porciones según peso (Scoop 5g)', ARRAY['100% Sello Creapure®', 'Sin saborizantes ni rellenos', 'Micronizada 200 mesh', 'Aumenta ATP muscular'])
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80', 'Creatina Creapure bote frontal', 1);

INSERT INTO product_variants (id, product_id, sku, title, flavor, size, price_in_cents, compare_at_price_in_cents, weight_grams, is_default) VALUES
('ebbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TOP-CREA-300', 'Puro Neutro - 300g (60 serv.)', 'Neutro (Sin Sabor)', '300g', 3850000, 4400000, 300, true),
('fbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TOP-CREA-500', 'Puro Neutro - 500g (100 serv.) [Ahorro]', 'Neutro (Sin Sabor)', '500g', 5890000, 6800000, 500, false);

-- Inventario de Producto 2
INSERT INTO inventory (variant_id, on_hand, reserved) VALUES
('ebbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 50, 0),
('fbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 28, 0)
ON CONFLICT DO NOTHING;
