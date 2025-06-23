# 🛠️ Production Deployment Guide - Ashlar House

*Guía completa de despliegue en producción - Actualizada: 13 de Junio, 2025*

## 🎯 Preparación para Producción

### Checklist Pre-Despliegue
- ✅ Sistema funcionando completamente en desarrollo
- ✅ Variables de entorno configuradas
- ✅ Base de datos preparada para migración
- ✅ Testing suite ejecutado y validado
- ✅ Documentación actualizada

## 🚀 Configuración de Render.com

### 1. Preparar Repositorio

```bash
# Commit todos los cambios
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

### 2. Configurar render.yaml

El archivo `render.yaml` ya está configurado:

```yaml
services:
  - type: web
    name: ashlar-house-backend
    env: node
    buildCommand: cd BACKEND && npm install && npm run build
    startCommand: cd BACKEND && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: HOST
        value: 0.0.0.0
      - key: PORT
        value: 10000
      - key: DATABASE_CLIENT
        value: postgres
      # Variables de entorno seguras (configurar en Render dashboard)
      - key: APP_KEYS
        sync: false
      - key: API_TOKEN_SALT
        sync: false
      - key: ADMIN_JWT_SECRET
        sync: false
      - key: TRANSFER_TOKEN_SALT
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CALLMEBOT_API_KEY_1
        sync: false
      - key: CALLMEBOT_API_KEY_2
        sync: false
      - key: EMAILJS_PUBLIC_KEY
        sync: false
      - key: EMAILJS_SERVICE_ID
        sync: false
      - key: EMAILJS_TEMPLATE_ID
        sync: false
```

### 3. Variables de Entorno en Render

En el dashboard de Render, configurar:

#### Strapi Core Variables
```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=10000

# Generar secretos únicos para producción
APP_KEYS="production-app-key-1,production-app-key-2"
API_TOKEN_SALT="production-api-token-salt"
ADMIN_JWT_SECRET="production-admin-jwt-secret"
TRANSFER_TOKEN_SALT="production-transfer-token-salt"
JWT_SECRET="production-jwt-secret"
```

#### Database Configuration
```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=ashlar_house_prod
DATABASE_USERNAME=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_SSL=true
```

#### Integration APIs
```bash
# WhatsApp CallMeBot
CALLMEBOT_API_KEY_1=4639929
CALLMEBOT_API_KEY_2=1855584

# EmailJS
EMAILJS_PUBLIC_KEY=fjE9Qo5zVa2mfHE4m
EMAILJS_SERVICE_ID=service_dk8fe1s
EMAILJS_TEMPLATE_ID=template_8xeecee

# Admin Email
ADMIN_EMAIL=admin@ashlarhouse.com
```

### 4. Base de Datos PostgreSQL

#### Configurar PostgreSQL en Render
```yaml
# Agregar al render.yaml
databases:
  - name: ashlar-house-db
    databaseName: ashlar_house_prod
    user: ashlar_user
```

#### Migración de Datos
```bash
# Exportar datos de desarrollo (SQLite)
npm run strapi export

# Importar a producción (PostgreSQL)
npm run strapi import
```

## 🌐 Frontend Deployment

### Opción 1: Hosting Estático (Recomendado)

#### Netlify
```bash
# Configurar build settings
Build command: (none)
Publish directory: FRONTEND
```

#### Vercel
```bash
# vercel.json
{
  "functions": {},
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/FRONTEND/$1"
    }
  ]
}
```

### Opción 2: CDN (Cloudflare)

#### Configuración Cloudflare Pages
```bash
Build command: (none)
Build output directory: FRONTEND
```

### 3. Actualizar URLs en Frontend

```javascript
// FRONTEND/js/newsletter-config.js
window.NEWSLETTER_CONFIG = {
    // Cambiar a URL de producción
    STRAPI_URL: 'https://ashlar-house-backend.onrender.com',
    
    // EmailJS mantiene las mismas credenciales
    EMAILJS_PUBLIC_KEY: 'fjE9Qo5zVa2mfHE4m',
    EMAILJS_SERVICE_ID: 'service_dk8fe1s',
    EMAILJS_TEMPLATE_ID: 'template_8xeecee'
};
```

## 🔐 Seguridad en Producción

### 1. CORS Configuration

```typescript
// BACKEND/config/middlewares.ts
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:'],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://your-frontend-domain.com',
        'https://ashlarhouse.com',
        'https://www.ashlarhouse.com'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  // ...otros middlewares
];
```

### 2. Rate Limiting

```typescript
// BACKEND/config/middlewares.ts
export default [
  // ...otros middlewares
  {
    name: 'strapi::rate-limit',
    config: {
      max: 100, // 100 requests
      duration: 60000, // per minute
    },
  },
];
```

### 3. SSL/HTTPS

Render automáticamente proporciona certificados SSL.

## 📊 Monitoring y Analytics

### 1. Health Checks

```javascript
// BACKEND/src/api/health/routes/health.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.check',
      config: {
        auth: false,
      },
    },
  ],
};
```

### 2. Logging

```typescript
// BACKEND/config/logger.ts
export default {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: 'json',
  transports: [
    {
      type: 'console',
    },
    {
      type: 'file',
      filename: 'logs/application.log',
      level: 'error',
    },
  ],
};
```

### 3. Error Tracking

Configurar Sentry o similar:

```javascript
// BACKEND/src/index.ts
import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}
```

## 🧪 Testing en Producción

### 1. Smoke Tests Post-Deployment

```bash
# Verificar que APIs responden
curl https://ashlar-house-backend.onrender.com/api/newsletter-subscribers
curl https://ashlar-house-backend.onrender.com/api/contact-messages

# Test de WhatsApp
curl -X POST https://ashlar-house-backend.onrender.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"data": {"guest_name": "Test", "status": "Reservado"}}'
```

### 2. Frontend Tests

```javascript
// Verificar conexión con backend
fetch('https://ashlar-house-backend.onrender.com/api/newsletter-subscribers')
  .then(response => response.json())
  .then(data => console.log('Backend connected:', data))
  .catch(error => console.error('Backend connection failed:', error));
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd BACKEND && npm install
      
      - name: Run tests
        run: cd BACKEND && npm test
        env:
          NODE_ENV: test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Render
        # Render se autodespliega desde GitHub
        run: echo "Deployment triggered automatically"
```

## 🚨 Troubleshooting de Producción

### Problemas Comunes

#### 1. Backend no inicia
```bash
# Verificar logs en Render
# Problemas típicos:
# - Variables de entorno faltantes
# - Error de conexión a base de datos
# - Puerto incorrecto
```

#### 2. CORS Errors
```javascript
// Verificar origen en middlewares.ts
// Asegurar que frontend domain esté en whitelist
```

#### 3. Database Connection Failed
```bash
# Verificar credenciales PostgreSQL
# Verificar que DATABASE_SSL=true
# Verificar conectividad de red
```

#### 4. WhatsApp/EmailJS Not Working
```bash
# Verificar que API keys estén configuradas
# Verificar logs de Strapi para errores
# Test individual de cada servicio
```

## 📋 Post-Deployment Checklist

### Funcionalidad
- ✅ Landing page carga correctamente
- ✅ Formulario de contacto funciona
- ✅ Newsletter subscription funciona
- ✅ Campaign manager accesible
- ✅ WhatsApp notifications se envían
- ✅ EmailJS emails se envían
- ✅ Strapi admin accesible

### Performance
- ✅ Tiempo de carga < 3 segundos
- ✅ APIs responden < 500ms
- ✅ Imágenes optimizadas
- ✅ CSS/JS minificado

### Security
- ✅ HTTPS habilitado
- ✅ CORS correctamente configurado
- ✅ Variables de entorno seguras
- ✅ Rate limiting activo

### SEO
- ✅ Meta tags configuradas
- ✅ Sitemap.xml generado
- ✅ robots.txt configurado
- ✅ Google Analytics integrado

## 🔧 Mantenimiento Continuo

### Daily
- Revisar logs de error
- Verificar métricas de performance
- Check health endpoints

### Weekly
- Backup de base de datos
- Review de security logs
- Performance optimization

### Monthly
- Actualizar dependencias
- Security patches
- Feature updates

## 📞 Support y Rollback

### Rollback Plan
```bash
# Si hay problemas críticos:
1. Revertir último commit
2. Redeployar versión anterior
3. Verificar funcionalidad
4. Investigar y corregir problema
```

### Emergency Contacts
- Render Support: Para problemas de hosting
- CallMeBot Support: Para problemas de WhatsApp
- EmailJS Support: Para problemas de email
