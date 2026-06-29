# 🏠 Ashlar House - Sistema de Gestión Turística

*Última actualización: 25 de Junio, 2025*

## � URLs Públicas

### 🖥️ Frontend (Vercel)
- **Producción**: https://ashlar-house.vercel.app
- **Dominio principal**: Ashlar House - Cabaña en Ciénega de González

### ⚙️ Backend (Railway)
- **API REST**: https://ashlar-house-production.up.railway.app
- **Admin Panel**: https://ashlar-house-production.up.railway.app/admin
- **Base de datos**: PostgreSQL en Railway

## �🎯 Resumen del Proyecto

**Ashlar House** es un sistema completo de gestión para propiedades turísticas que combina:
- **Landing Page** moderna y responsive con formularios inteligentes
- **Sistema de Reservas** con calendario en tiempo real sincronizado
- **CMS Backend** (Strapi v5 + TypeScript) con APIs REST automáticas
- **Notificaciones WhatsApp** automáticas duales para nuevas reservas
- **Sistema de Newsletter** dual (Email + WhatsApp) con auto-suscripción
- **Sincronización Airbnb** automática cada 3 horas
- **Campaign Management** para gestión de suscriptores y listas
- **Testing Suite** completo para verificación del sistema

## ✨ Estado Actual - PRODUCCIÓN ACTIVA

### 🚀 Deploys Exitosos
- ✅ **Frontend**: Desplegado en Vercel con configuración automática
- ✅ **Backend**: Desplegado en Railway con PostgreSQL
- ✅ **Base de datos**: Migración completa de SQLite → PostgreSQL
- ✅ **Variables de entorno**: Configuradas para desarrollo y producción
- ✅ **CORS y CSP**: Configurados correctamente para ambos dominios

### 🏠 Sistema Principal
- ✅ **Landing Page Responsive** - Diseño moderno con Tailwind CSS
- ✅ **Galería Visual** - Fotos y video hero interactivos (funcionando)
- ✅ **Modo Claro/Oscuro** - Tema adaptable
- ✅ **Calendario Interactivo** - FullCalendar con disponibilidad en tiempo real
- ✅ **SEO Optimizado** - Meta tags y estructura semántica

### 📱 Sistema de Notificaciones WhatsApp
- ✅ **Dual Phone Delivery** - Envío automático a dos números
- ✅ **CallMeBot Integration** - API configurada y funcionando
- ✅ **Lifecycle Hooks** - Automatización completa en Strapi
- ✅ **Formateo Inteligente** - Mensajes personalizados por tipo de evento
- ✅ **Error Handling** - Manejo robusto con logging detallado

### 📧 Sistema de Newsletter y Contacto
- ✅ **Newsletter Dual** - Suscripción simultánea Email + WhatsApp
- ✅ **EmailJS Integration** - Configurado con credenciales de producción
- ✅ **Auto-Suscripción** - Desde formulario de contacto
- ✅ **Validación Avanzada** - Frontend y backend con TypeScript
- ✅ **Campaign Manager** - Gestión de listas y exportación de datos
- ✅ **Formularios Inteligentes** - Estados de carga y feedback visual

### 🔄 Automatización
- ✅ **Sincronización Airbnb** - iCal automático cada 3 horas
- ✅ **Cron Jobs** - Programación automática de tareas
- ✅ **Lifecycle Automation** - Hooks para eventos del sistema
- ✅ **Health Checks** - Monitoreo automático del sistema

## Stack Tecnológico
- **Frontend**: HTML + JavaScript con Vite (build y dev server), Tailwind CSS
- **Backend**: Strapi v5 + TypeScript como CMS headless
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Notificaciones**: CallMeBot WhatsApp API con lifecycle hooks
- **Email Service**: EmailJS para newsletter y notificaciones automáticas
- **APIs**: RESTful APIs generadas por Strapi + EmailJS integration
- **Runtime**: Node.js 18+ con fetch nativo (recomendado: 22+)
- **Control de versiones**: Git/GitHub
- **Despliegue**: 
  - **Frontend**: Vercel (desplegado)
  - **Backend**: Railway (desplegado)
  - **Base de datos**: PostgreSQL en Railway

## 🏗️ Arquitectura de Despliegue

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   USUARIO       │    │    FRONTEND      │    │    BACKEND      │
│   (Navegador)   │◄──►│   Vercel         │◄──►│   Railway       │
│                 │    │   ashlar-house.  │    │   Strapi v5     │
│                 │    │   vercel.app     │    │   PostgreSQL    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                       ┌─────────────┐         ┌─────────────┐
                       │  EmailJS    │         │ CallMeBot   │
                       │  (Email)    │         │ (WhatsApp)  │
                       └─────────────┘         └─────────────┘
```

## Estructura del Proyecto
```
/
├── FRONTEND/              # Landing Page (Vite)
│   ├── src/               # Entradas multipágina
│   │   ├── index.html     # Página principal
│   │   └── campaign-manager.html # Panel de campañas
│   ├── public/            # Estáticos servidos tal cual
│   │   ├── assets/        # Imágenes y recursos
│   │   └── js/            # JS: global-config, campaign-manager, whatsapp-lists-manager
│   ├── vite.config.js     # Config de build (multipágina, dist/)
│   └── package.json       # Scripts dev/build/preview
├── BACKEND/               # Servidor Strapi v5 + TypeScript
│   ├── src/               # Código fuente de Strapi
│   │   ├── index.ts       # Bootstrap y lifecycle hooks WhatsApp 
│   │   └── api/          # APIs y content types
│   │       ├── newsletter-subscriber/ # API para suscriptores newsletter
│   │       ├── contact-message/       # API para mensajes de contacto
│   │       ├── hero/                  # API para video/contenido hero
│   │       ├── carousel/              # API para galería de imágenes
│   │       └── map-location/          # API para ubicaciones del mapa
│   ├── config/           # Configuración de Strapi
│   │   ├── database.ts   # Configuración SQLite (dev) / PostgreSQL (prod)
│   │   ├── middlewares.ts # CORS, CSP y middlewares
│   │   └── plugins.ts    # Configuración de plugins
│   ├── scripts/          # Utilidades y herramientas de desarrollo
│   └── archive-test-files/ # Archivos de test archivados (desarrollo)
├── DOCS/                 # Documentación del proyecto
│   ├── HISTORY/          # Logs de troubleshooting y cambios
│   └── SETUP/           # Guías de configuración
├── RAILWAY-CONFIGURATION.md # Configuración específica de Railway
├── railway.toml          # Configuración de despliegue Railway
├── vercel.json           # Configuración de despliegue Vercel
└── README.md              # Este archivo
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (v18 o superior, recomendado: v22+)
- npm o yarn
- Git

### 🔧 Configuración del Entorno de Desarrollo

1. **Clonar el repositorio:**
```bash
git clone https://github.com/goterog/Ashlar-House.git
cd Ashlar-House
```

2. **Instalar dependencias del backend:**
```bash
cd BACKEND
npm install
```

3. **Configurar variables de entorno:**
En `BACKEND/`, crear `.env` a partir del template:
```bash
cp .env.example .env
```

Opcionalmente, puedes iniciar desde el preset de desarrollo:
```bash
cp .env.development .env
```

Variables mínimas requeridas:
```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS=tu-app-key-aqui
API_TOKEN_SALT=tu-api-token-salt
ADMIN_JWT_SECRET=tu-admin-jwt-secret
TRANSFER_TOKEN_SALT=tu-transfer-token-salt
JWT_SECRET=tu-jwt-secret

# Base de datos (SQLite para desarrollo)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# CallMeBot API para WhatsApp
CALLMEBOT_API_KEY_1=tu-api-key-numero-1
CALLMEBOT_API_KEY_2=tu-api-key-numero-2
CALLMEBOT_PHONE_1=+5215500000001
CALLMEBOT_PHONE_2=+5215500000002

# Airbnb sync (URL iCal del listado)
AIRBNB_ICS_URL=https://www.airbnb.mx/calendar/ical/tu-listado.ics?s=tu-token
```

4. **Iniciar el servidor Strapi:**
```bash
npm run develop  # Si falta .env y existe .env.development, se crea automáticamente
```

5. **Configurar el Frontend (Vite):**
```bash
cd FRONTEND
npm install
npm run dev        # Servidor local en http://localhost:3000
```

### ⚡ Scripts de Desarrollo Disponibles

#### Backend (BACKEND/)
```bash
npm run develop    # Modo desarrollo con auto-reload
npm run dev:fresh  # Desarrollo con build limpio
npm run build      # Build para producción
npm run start      # Modo producción

# Scripts de desarrollo y diagnóstico
npm run dev-tools                      # Script maestro con menú interactivo
node scripts/health-check.js           # Verificación rápida del sistema
node scripts/check-strapi.js           # Verificar conectividad Strapi
```

#### Frontend (FRONTEND/)
```bash
npm run dev        # Dev server (Vite) en http://localhost:3000
npm run build      # Build de producción a dist/
npm run preview    # Previsualizar el build
```

### 🌐 URLs de Acceso

#### Desarrollo Local
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:1337
- **Admin Panel**: http://localhost:1337/admin

#### Producción
- **Frontend**: https://ashlar-house.vercel.app
- **Backend API**: https://ashlar-house-production.up.railway.app
- **Admin Panel**: https://ashlar-house-production.up.railway.app/admin

## 🔄 Flujo de Trabajo de Desarrollo

### Entornos Separados
```bash
# Desarrollo Local (SQLite)
NODE_ENV=development  # Usa .env.development
DATABASE_CLIENT=sqlite

# Producción (PostgreSQL en Railway)  
NODE_ENV=production   # Usa variables de Railway
DATABASE_CLIENT=postgres
```

### Proceso de Deploy
1. **Desarrollo**: Trabajar en local con SQLite
2. **Test**: Verificar funcionalidad completa
3. **Commit**: Subir cambios a repositorio
4. **Deploy automático**: 
   - Vercel deploy automático del frontend## 📚 Metodología de Desarrollo

Este proyecto sigue un enfoque iterativo con las siguientes prácticas:
- **TypeScript-first approach** con Strapi v5
- **Lifecycle hooks** para automatización de procesos
- **Comprehensive testing** con herramientas de desarrollo
- Desarrollo por ramas para experimentar con nuevas características
- Merge a main solo cuando las características están estables
- Enfoque en usabilidad y experiencia de usuario
- Optimización progresiva de rendimiento

## 📖 Documentación Adicional

- **[DOCS/](DOCS/)** - Documentación completa del proyecto
- **[RAILWAY-CONFIGURATION.md](RAILWAY-CONFIGURATION.md)** - Configuración específica de Railway
- **[BACKEND/scripts/README.md](BACKEND/scripts/README.md)** - Herramientas de desarrollo
- **[DOCS/HISTORY/](DOCS/HISTORY/)** - Logs de troubleshooting y cambios

## ✅ Estado de Funcionalidades

### Completadas y en Producción
- [x] **Landing Page Responsive** con Tailwind CSS
- [x] **Sistema de Reservas** con calendario interactivo
- [x] **Notificaciones WhatsApp** duales automáticas
- [x] **Sistema de Newsletter** dual (Email + WhatsApp)
- [x] **CMS Backend** (Strapi v5 + TypeScript) 
- [x] **Sincronización Airbnb** automática cada 3 horas
- [x] **APIs REST** automáticas para todos los content types
- [x] **Deploy en Producción** (Vercel + Railway)
- [x] **Base de datos PostgreSQL** en producción
- [x] **Variables de entorno** separadas por ambiente
- [x] **CORS y CSP** configurados correctamente
- [x] **Video Hero** carga dinámica desde Strapi

### Próximas Mejoras
- [ ] Optimizar carga de imágenes con lazy loading avanzado
- [ ] Implementar sistema de respaldos automáticos
- [ ] Añadir tests unitarios e integración automatizados
- [ ] Implementar retry logic robusto para notificaciones
- [ ] Sistema de logging estructurado con Winston
- [ ] Monitoreo y alertas de uptime
- [ ] Cache estratégico para mejorar rendimiento

## 🎯 Conclusión

**Ashlar House** es un sistema completo y robusto que está actualmente **operando en producción** sirviendo tanto la experiencia de usuario final como la gestión administrativa del negocio turístico.

**URLs en vivo:**
- 🌐 **Website**: https://ashlar-house.vercel.app
- ⚙️ **Admin Panel**: https://ashlar-house-production.up.railway.app/admin

---
*Para preguntas técnicas o soporte, consultar la documentación en `/DOCS/` o contactar al equipo de desarrollo.*

## Contribuciones y Sugerencias
Este proyecto está siendo desarrollado como una oportunidad de aprendizaje, por lo que las sugerencias, recomendaciones y explicaciones sobre mejores prácticas son bienvenidas. Si tienes ideas para mejorar el código, la arquitectura o añadir nuevas características, no dudes en compartirlas.

Como desarrollador en proceso de aprendizaje, aprecio especialmente:
- Explicaciones detalladas de conceptos
- Sugerencias de refactorización
- Recomendaciones sobre patrones de diseño
- Consejos para optimización

## Contacto
Para cualquier consulta relacionada con este proyecto, puedes contactarme a través de guillermo.a.otero@gmail.com

---

*Este README es un documento vivo que se actualizará a medida que el proyecto evolucione.*