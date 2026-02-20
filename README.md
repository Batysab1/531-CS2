# 531 Accounts — Guía de Despliegue en Vercel

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Base de datos**: PostgreSQL via Vercel Postgres
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Chat real-time**: Pusher
- **Estilos**: Tailwind CSS
- **Deploy**: Vercel

---

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com) (gratis)
2. Cuenta en [Pusher](https://pusher.com) (gratis — plan Sandbox)
3. Node.js 18+ instalado localmente

---

## ⚡ Despliegue Paso a Paso

### 1. Subir a GitHub

```bash
cd 531accounts
git init
git add .
git commit -m "Initial commit — 531 Accounts"
# Crea un repo en github.com y sigue las instrucciones
git remote add origin https://github.com/tuusuario/531accounts.git
git push -u origin main
```

### 2. Crear proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) → **New Project**
2. Importa el repositorio de GitHub
3. Framework: **Next.js** (se detecta automáticamente)
4. **NO hagas Deploy todavía** — primero configura las variables

### 3. Configurar Vercel Postgres

1. En tu proyecto Vercel → **Storage** → **Create Database** → **Postgres**
2. Selecciona región más cercana (eu-west-1 para España)
3. Las variables `POSTGRES_PRISMA_URL` y `POSTGRES_URL_NON_POOLING` se añadirán automáticamente

### 4. Configurar Pusher (Chat en tiempo real)

1. Ve a [pusher.com](https://pusher.com) → Crea una cuenta gratis
2. **Create App** → Nombre: `531accounts` → Cluster: `eu`
3. Ve a **App Keys** y anota:
   - App ID
   - Key
   - Secret
   - Cluster

### 5. Variables de Entorno en Vercel

En Vercel → tu proyecto → **Settings** → **Environment Variables**, añade:

```env
# NextAuth (genera con: openssl rand -base64 32)
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu-secret-generado-aqui

# Pusher
PUSHER_APP_ID=tu_app_id
PUSHER_KEY=tu_key
PUSHER_SECRET=tu_secret
PUSHER_CLUSTER=eu
NEXT_PUBLIC_PUSHER_KEY=tu_key
NEXT_PUBLIC_PUSHER_CLUSTER=eu

# Discord
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/tu-server
NEXT_PUBLIC_DISCORD_TICKET_URL=https://discord.com/channels/id/id
```

> Las variables de Postgres (`POSTGRES_PRISMA_URL` y `POSTGRES_URL_NON_POOLING`) ya deben estar añadidas automáticamente por Vercel Postgres.

### 6. Deploy y Seed de Base de Datos

1. Haz **Deploy** en Vercel
2. Una vez desplegado, en Vercel → **Functions** o desde tu terminal:

```bash
# Instalar dependencias localmente
npm install

# Configurar .env.local con las variables (copia de Vercel)
cp .env.example .env.local
# Edita .env.local con tus valores reales

# Ejecutar migraciones
npx prisma db push

# Ejecutar seed (crea admin + datos de ejemplo)
npx tsx prisma/seed.ts
```

### 7. Acceder al Panel Admin

Después del seed, el usuario superadmin es:
- **Email**: `admin@531accounts.com`
- **Password**: `admin531!`

⚠️ **¡Cambia la contraseña inmediatamente!**

---

## 🔑 Funcionalidades

### Para Usuarios
- Registro e inicio de sesión
- Ver y filtrar cuentas CS2
- Ver y comprar skins
- Chat de boost en tiempo real con admins
- Copiar credenciales tras compra
- Abrir tickets en Discord

### Para Admins
- Dashboard con estadísticas en tiempo real
- **Cuentas**: Crear, editar, eliminar, destacar, marcar como vendida, gestionar credenciales
- **Skins**: CRUD completo con StatTrak, Souvenir, float, stickers
- **Boost**: Responder chats de usuarios en tiempo real (Pusher)
- **Usuarios**: Ver todos los usuarios, banear/desbanear, dar/quitar rol Admin

### Para SuperAdmin
- Todo lo anterior + cambiar roles de cualquier usuario (USER → ADMIN → SUPERADMIN)

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Página principal
│   ├── login/                # Login
│   ├── register/             # Registro
│   ├── cuentas/              # Listado y detalle de cuentas
│   ├── skins/                # Listado de skins
│   ├── boost/                # Servicio de boost + chat
│   ├── discord/              # Página de Discord
│   ├── admin/                # Panel admin (protegido)
│   │   ├── cuentas/          # CRUD cuentas
│   │   ├── skins/            # CRUD skins
│   │   ├── boost/            # Gestión chats boost
│   │   └── usuarios/         # Gestión usuarios
│   └── api/                  # API Routes
│       ├── auth/             # NextAuth + registro
│       ├── accounts/         # Compra de cuentas
│       ├── boost/            # Mensajes (Pusher)
│       └── admin/            # Operaciones admin
├── components/               # Componentes compartidos
└── lib/                      # Prisma, Auth, Pusher, Utils
prisma/
├── schema.prisma             # Modelos de BD
└── seed.ts                   # Datos iniciales
```

---

## 🔧 Desarrollo Local

```bash
npm install
cp .env.example .env.local
# Edita .env.local con tus valores

npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Visita: http://localhost:3000

---

## 💡 Notas Importantes

- **Credenciales de cuentas**: Se almacenan en la BD y solo se muestran al comprador tras la compra. En producción considera cifrarlas.
- **Pagos reales**: Este sistema simula el flujo de compra. Para pagos reales, integra Stripe o PayPal.
- **Pusher Free**: El plan Sandbox soporta 100 conexiones simultáneas y 200k mensajes/día — suficiente para empezar.
- **Vercel Postgres Free**: 60h de compute, 256MB almacenamiento — suficiente para comenzar.
