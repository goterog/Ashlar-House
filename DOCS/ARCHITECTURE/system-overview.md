# 🏗️ Arquitectura del Sistema - Ashlar House

*Documentación técnica completa - Actualizada: 13 de Junio, 2025*

## 📋 Visión General

**Ashlar House** es un sistema completo de gestión turística que combina:
- **Landing Page** estática con formularios interactivos
- **CMS Backend** (Strapi v5) con APIs REST automáticas
- **Sistema de Notificaciones** WhatsApp + Email
- **Sincronización Airbnb** para disponibilidad en tiempo real

## 🎯 Stack Tecnológico

### Frontend
- **HTML5 + JavaScript Vanilla** - Sin frameworks pesados
- **Tailwind CSS** - Diseño responsivo y moderno
- **FullCalendar** - Calendario interactivo de reservas
- **EmailJS** - Envío de emails desde frontend

### Backend
- **Strapi v5** - CMS Headless con TypeScript
- **SQLite** - Base de datos ligera para desarrollo
- **CallMeBot API** - Notificaciones WhatsApp
- **Lifecycle Hooks** - Automatización de procesos

### DevOps & Deployment
- **Render.com** - Hosting backend
- **GitHub** - Control de versiones
- **Environment Variables** - Configuración segura

## 🔧 Arquitectura Técnica

### 1. Frontend (Estático)
```
FRONTEND/
├── Ashlar House.html        # Landing page principal
├── campaign-manager.html    # Gestión de campañas
├── js/
│   ├── newsletter.js        # Sistema newsletter completo
│   ├── newsletter-config.js # Configuración EmailJS
│   ├── campaign-manager.js  # Gestión de suscriptores
│   └── whatsapp-lists-manager.js # Gestión WhatsApp
├── assets/                  # Imágenes y recursos
└── test-*.html             # Páginas de testing
```

### 2. Backend (Strapi v5 + TypeScript)
```
BACKEND/
├── src/
│   ├── index.ts            # 🎯 Bootstrap principal + Lifecycle Hooks
│   ├── api/
│   │   ├── contact-message/       # Content-type mensajes y suscripciones
│   │   ├── booking/               # Content-type reservas
│   │   ├── carousel/              # Content-type carousel
│   │   ├── global/                # Content-type configuración global
│   │   ├── hero/                  # Content-type hero section
│   │   └── map-location/          # Content-type ubicación
│   └── extensions/         # Extensiones Strapi customizadas
├── config/                 # Configuración Strapi
├── types/                  # Definiciones TypeScript
└── scripts/               # Herramientas de desarrollo
```

## 📊 Content Types (Esquemas de Datos)

### 1. Contact Message (Unificado: Contacto + Newsletter)
```typescript
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: 'informacion_general' | 'reserva' | 'cancelacion' | 'otro';
  message: string;
  newsletter_email: boolean;    // Auto-suscripción email
  newsletter_whatsapp: boolean; // Auto-suscripción WhatsApp
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Booking
```typescript
interface Booking {
  id: number;
  guest_name: string;
  email: string;
  phone: string;
  check_in: Date;
  check_out: Date;
  guests: number;
  status: 'Reservado' | 'Bloqueado' | 'Disponible';
  airbnb_calendar_id?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔄 Flujos de Trabajo

### 1. Flujo Newsletter Subscription (a través de Contact Message)
```
Usuario en Frontend → Llena formulario → 
Validación JavaScript → POST /api/contact-messages → 
Strapi crea registro → Si newsletter_email=true → 
EmailJS envía confirmación → Usuario recibe email confirmación
```

### 2. Flujo Contact Message con Suscripción Automática
```
Usuario en Frontend → Llena formulario contacto → 
Validación JavaScript → POST /api/contact-messages → 
Strapi crea registro contact-message → 
Si newsletter_email/whatsapp=true → Datos guardados para newsletter →
EmailJS envía email → Admin recibe notificación
```

### 3. Flujo WhatsApp Notifications
```
Reserva creada → Lifecycle Hook (afterCreate) → 
Formateo mensaje → CallMeBot API → 
WhatsApp enviado a 2 números → Logging completo
```

## 🔐 Seguridad y Configuración

### Variables de Entorno (.env)
```bash
# Strapi Core
HOST=0.0.0.0
PORT=1337
APP_KEYS="strapi-app-keys"
API_TOKEN_SALT="api-token-salt"
ADMIN_JWT_SECRET="admin-jwt-secret"
TRANSFER_TOKEN_SALT="transfer-token-salt"
JWT_SECRET="jwt-secret"

# WhatsApp CallMeBot
CALLMEBOT_API_KEY_1=4639929    # +5218119936655
CALLMEBOT_API_KEY_2=1855584    # +5218111755533

# EmailJS (Backend)
EMAILJS_PUBLIC_KEY=fjE9Qo5zVa2mfHE4m
EMAILJS_SERVICE_ID=service_dk8fe1s
EMAILJS_TEMPLATE_ID=template_8xeecee

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

## 🚀 Deployment Architecture

### Desarrollo Local
- **Backend**: `npm run develop` (localhost:1337)
- **Frontend**: Live Server o servidor estático
- **Database**: SQLite local

### Producción (Render.com)
- **Backend**: Strapi deployado automáticamente
- **Frontend**: Servido estáticamente o CDN
- **Database**: PostgreSQL o MySQL en producción
- **Environment**: Variables seguras en Render

## 📈 Escalabilidad

### Horizontal Scaling
- **Frontend**: CDN global para assets estáticos
- **Backend**: Load balancers para múltiples instancias Strapi
- **Database**: Clustering PostgreSQL o MySQL

### Performance Optimization
- **Caching**: Redis para sesiones y cache
- **CDN**: Cloudflare para assets y API caching
- **Database**: Índices optimizados y queries eficientes

## 🔧 Mantenimiento

### Monitoring
- **Health Checks**: Scripts automáticos de verificación
- **Error Logging**: Winston para logs estructurados
- **Performance**: Monitoring de APIs y response times

### Backup Strategy
- **Database**: Backups automáticos diarios
- **Code**: Git con branches de producción
- **Configuration**: Environment variables versionadas
