# Suplementos Top — Ecommerce Premium de Nutrición y Rendimiento Deportivo

Plataforma de comercio electrónico profesional, segura, escalable y optimizada para la venta y distribución de suplementos deportivos en Argentina.

---

## 📌 Datos Comerciales de la Tienda
- **Nombre:** Suplementos Top
- **Horarios de atención:** Lunes a Viernes de 8:00 a 23:00 hs | Sábados de 10:00 a 18:00 hs
- **Punto de Retiro y Despacho:** Uriburu 1163, entre Av. Santa Fe y Arenales, Recoleta, CABA.
- **WhatsApp Oficial (Ventas y Despachos):** +54 9 11 6565-1990
- **Email Oficial:** suplementostopparg@gmail.com
- **Instagram:** [@suplementos_topp](https://instagram.com/suplementos_topp)

---

## 🛠️ Stack Tecnológico
- **Frontend:** React 18 + TypeScript + Vite + React Router 6.
- **Estilos:** CSS moderno estructurado por componentes con variables CSS (`variables.css`, `base.css`, `components.css`).
- **Iconografía:** Lucide React.
- **Formularios & Validaciones:** React Hook Form + Zod.
- **Backend & DB:** Supabase (PostgreSQL 15+, Auth, Storage, Edge Functions en Deno).
- **Seguridad:** Row Level Security (RLS) en todas las tablas, control transaccional de stock con bloqueo pesimista y TTL de reservas.
- **Pagos:** Mercado Pago Checkout Pro (Orders & Preferences API con Webhooks idempotentes).
- **Notificaciones:** Resend (Emails transaccionales HTML) y avisos automáticos formateados a WhatsApp.
- **Hosting:** Vercel (Frontend) + Supabase Cloud (Backend).

---

## 🚀 Puesta en Marcha Local

### 1. Clonar e instalar dependencias
```bash
cd suplementos-top
npm install
```

### 2. Configurar variables de entorno
Copiar `.env.example` a `.env` y configurar las claves:
```bash
cp .env.example .env
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### 4. Compilar para producción
```bash
npm run build
```

---

## 🗄️ Base de Datos y Migraciones (Supabase)

Las migraciones SQL se encuentran en la carpeta `supabase/migrations/`:
1. `20261113000001_initial_schema.sql`: Esquema relacional completo (todas las monedas en centavos `INTEGER`).
2. `20261113000002_rls_policies.sql`: Políticas de seguridad RLS para proteger datos privados de compras e inventario.
3. `20261113000003_stock_triggers.sql`: Procedimientos almacenados para reserva temporal (`reserve_stock_for_checkout`), liberación de reservas vencidas (`release_expired_stock_reservations`) y confirmación de venta tras pago de Mercado Pago (`confirm_order_stock_payment`).
4. `20261113000004_seed_suplementos_data.sql`: Carga inicial con los datos comerciales de **Suplementos Top**, categorías y catálogo inicial con variantes de sabor y tamaño.

---

## 💳 Flujo de Pago con Mercado Pago y Alerta al Dueño

1. **Creación de Orden del lado Servidor:**
   El frontend envía los items al endpoint `create-payment-order`. La función recalcula importes consultando PostgreSQL y reserva el stock por 15 minutos.
2. **Generación del Checkout Pro:**
   Se genera la preferencia en Mercado Pago con `back_urls` e `id` de referencia interno inmutable.
3. **Webhook Seguro:**
   Al aprobarse el pago, Mercado Pago notifica a `mercadopago-webhook`. La función valida el evento contra la API oficial, descuenta el stock físico definitivo y actualiza la orden.
4. **Despacho Inmediato:**
   Se envía un correo al comprador con su comprobante y **se envía una alerta prioritaria tanto por email como por WhatsApp al 11 6565 1990 con todos los datos del comprador (Nombre, DNI, Teléfono, Dirección de entrega o retiro en Uriburu 1163 y suplementos a embalar)**.

---

## 📦 Despliegue en GitHub y Vercel

1. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit Suplementos Top ecommerce"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/suplementos-top.git
   git push -u origin main
   ```

2. **Vercel:**
   - Importar el repositorio desde el dashboard de Vercel.
   - En **Build & Development Settings**, Framework Preset: `Vite`.
   - Cargar las variables de entorno de producción desde `.env.example`.
   - Vercel leerá automáticamente `vercel.json` para enrutar todas las URLs al index.
