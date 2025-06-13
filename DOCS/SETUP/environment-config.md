# ⚙️ Environment Configuration Guide - Ashlar House

*Guía completa de configuración de variables de entorno - Actualizada: 13 de Junio, 2025*

## 🎯 Resumen de Variables de Entorno

El sistema Ashlar House requiere configuración de variables de entorno para:
- **Strapi Core**: Configuración básica del CMS
- **Database**: Conexión a base de datos  
- **WhatsApp**: Integración CallMeBot API
- **EmailJS**: Servicio de emails
- **Security**: Tokens y secretos

## 📁 Estructura de Archivos de Configuración

```
BACKEND/
├── .env                    # Variables de entorno (NO subir a Git)
├── .env.example           # Template de configuración
├── .env.development       # Variables específicas de desarrollo
├── .env.production        # Variables específicas de producción
└── config/
    ├── database.ts        # Configuración de base de datos
    ├── server.ts          # Configuración del servidor
    └── middlewares.ts     # Middlewares y CORS
```

## 🔧 Configuración por Entorno

### Development (.env)

```bash
# ================================
# STRAPI CORE CONFIGURATION
# ================================
NODE_ENV=development
HOST=0.0.0.0
PORT=1337

# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
APP_KEYS="strapi-app-key-1,strapi-app-key-2,strapi-app-key-3,strapi-app-key-4"

# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
API_TOKEN_SALT="your-api-token-salt-here"

# Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
ADMIN_JWT_SECRET="your-admin-jwt-secret-here"

# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
TRANSFER_TOKEN_SALT="your-transfer-token-salt-here"

# Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your-jwt-secret-here"

# ================================
# DATABASE CONFIGURATION (Development)
# ================================
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Para PostgreSQL en desarrollo (opcional):
# DATABASE_CLIENT=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=ashlar_house_dev
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=your-password
# DATABASE_SSL=false

# ================================
# WHATSAPP INTEGRATION (CallMeBot)
# ================================
# Número principal: +52 811 993 6655
CALLMEBOT_API_KEY_1=4639929

# Número secundario: +52 811 175 5533  
CALLMEBOT_API_KEY_2=1855584

# ================================
# EMAIL INTEGRATION (EmailJS)
# ================================
EMAILJS_PUBLIC_KEY=fjE9Qo5zVa2mfHE4m
EMAILJS_SERVICE_ID=service_dk8fe1s
EMAILJS_TEMPLATE_ID=template_8xeecee

# ================================
# ADMIN CONFIGURATION
# ================================
ADMIN_EMAIL=admin@ashlarhouse.com

# ================================
# EXTERNAL INTEGRATIONS
# ================================
# Airbnb iCal URL (opcional)
AIRBNB_ICAL_URL=https://calendar.airbnb.com/calendar/ical/your-calendar-id

# ================================
# DEBUGGING & LOGGING
# ================================
DEBUG=strapi:*
LOG_LEVEL=debug
```

### Production (.env.production)

```bash
# ================================
# STRAPI CORE CONFIGURATION (Production)
# ================================
NODE_ENV=production
HOST=0.0.0.0
PORT=10000

# ⚠️ CRITICAL: Generar secretos únicos para producción
# NO reutilizar secretos de desarrollo
APP_KEYS="production-app-key-1,production-app-key-2,production-app-key-3,production-app-key-4"
API_TOKEN_SALT="production-api-token-salt"
ADMIN_JWT_SECRET="production-admin-jwt-secret"
TRANSFER_TOKEN_SALT="production-transfer-token-salt"
JWT_SECRET="production-jwt-secret"

# ================================
# DATABASE CONFIGURATION (Production)
# ================================
DATABASE_CLIENT=postgres
DATABASE_HOST=your-production-db-host
DATABASE_PORT=5432
DATABASE_NAME=ashlar_house_prod
DATABASE_USERNAME=ashlar_user
DATABASE_PASSWORD=your-secure-password
DATABASE_SSL=true

# ================================
# WHATSAPP INTEGRATION (Same as dev)
# ================================
CALLMEBOT_API_KEY_1=4639929
CALLMEBOT_API_KEY_2=1855584

# ================================
# EMAIL INTEGRATION (Same as dev)
# ================================
EMAILJS_PUBLIC_KEY=fjE9Qo5zVa2mfHE4m
EMAILJS_SERVICE_ID=service_dk8fe1s
EMAILJS_TEMPLATE_ID=template_8xeecee

# ================================
# ADMIN CONFIGURATION
# ================================
ADMIN_EMAIL=admin@ashlarhouse.com

# ================================
# PRODUCTION SETTINGS
# ================================
# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_DURATION=60000

# CORS origins (comma separated)
CORS_ORIGINS=https://ashlarhouse.com,https://www.ashlarhouse.com

# ================================
# MONITORING & LOGGING
# ================================
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn-here

# ================================
# SSL & SECURITY
# ================================
HTTPS_ENABLED=true
TRUST_PROXY=true
```

## 🔐 Generación de Secretos

### Scripts de Generación

```javascript
// generate-secrets.js
const crypto = require('crypto');

console.log('=== ASHLAR HOUSE - SECRET GENERATOR ===\n');

// APP_KEYS (4 keys separated by commas)
const appKeys = Array.from({length: 4}, () => 
  crypto.randomBytes(32).toString('base64')
).join(',');

console.log('APP_KEYS="' + appKeys + '"\n');

// Other secrets
console.log('API_TOKEN_SALT="' + crypto.randomBytes(32).toString('base64') + '"');
console.log('ADMIN_JWT_SECRET="' + crypto.randomBytes(64).toString('hex') + '"');
console.log('TRANSFER_TOKEN_SALT="' + crypto.randomBytes(32).toString('base64') + '"');
console.log('JWT_SECRET="' + crypto.randomBytes(64).toString('hex') + '"');

console.log('\n⚠️ IMPORTANT: Save these secrets securely!');
console.log('🔒 Never share or commit these values to Git');
```

```bash
# Ejecutar generador
node generate-secrets.js
```

### Manual Generation (Node.js REPL)

```bash
# Iniciar Node.js
node

# Generar APP_KEYS
Array.from({length: 4}, () => require('crypto').randomBytes(32).toString('base64')).join(',')

# Generar API_TOKEN_SALT
require('crypto').randomBytes(32).toString('base64')

# Generar ADMIN_JWT_SECRET
require('crypto').randomBytes(64).toString('hex')

# Generar TRANSFER_TOKEN_SALT
require('crypto').randomBytes(32).toString('base64')

# Generar JWT_SECRET
require('crypto').randomBytes(64).toString('hex')
```

## 🗃️ Database Configuration

### SQLite (Development)

```typescript
// config/database.ts
export default ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: env('DATABASE_FILENAME', '.tmp/data.db'),
    },
    useNullAsDefault: true,
  },
});
```

### PostgreSQL (Production)

```typescript
// config/database.ts
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'ashlar_house'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    debug: false,
  },
});
```

### MySQL (Alternative)

```typescript
// config/database.ts
export default ({ env }) => ({
  connection: {
    client: 'mysql2',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'ashlar_house'),
      user: env('DATABASE_USERNAME', 'root'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
```

## 🌐 Server Configuration

### Basic Server Config

```typescript
// config/server.ts
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
```

### Advanced Server Config

```typescript
// config/server.ts
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Production settings
  ...(env('NODE_ENV') === 'production' && {
    url: env('PUBLIC_URL', 'https://ashlar-house-backend.onrender.com'),
    proxy: env.bool('TRUST_PROXY', true),
  }),
});
```

## 🛡️ Security & Middleware Configuration

### CORS Setup

```typescript
// config/middlewares.ts
export default [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: process.env.NODE_ENV === 'production' 
        ? (process.env.CORS_ORIGINS || '').split(',').filter(Boolean)
        : ['http://localhost:3000', 'http://localhost:8000', 'http://127.0.0.1:8000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Rate Limiting

```typescript
// config/middlewares.ts (production only)
export default [
  // ...otros middlewares
  ...(process.env.NODE_ENV === 'production' ? [{
    name: 'strapi::rate-limit',
    config: {
      max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
      duration: parseInt(process.env.RATE_LIMIT_DURATION || '60000'),
    },
  }] : []),
];
```

## 🧪 Environment Validation

### Validation Script

```javascript
// scripts/validate-env.js
const requiredVars = [
  'APP_KEYS',
  'API_TOKEN_SALT', 
  'ADMIN_JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
  'JWT_SECRET',
  'CALLMEBOT_API_KEY_1',
  'CALLMEBOT_API_KEY_2',
  'EMAILJS_PUBLIC_KEY',
  'EMAILJS_SERVICE_ID',
  'EMAILJS_TEMPLATE_ID'
];

const optionalVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'ADMIN_EMAIL',
  'AIRBNB_ICAL_URL'
];

console.log('🔍 Validating environment variables...\n');

let allRequired = true;

// Check required variables
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.error(`❌ ${varName}: Missing (REQUIRED)`);
    allRequired = false;
  }
});

console.log('\n📋 Optional variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚠️ ${varName}: Not set (optional)`);
  }
});

if (allRequired) {
  console.log('\n🎉 All required environment variables are set!');
  process.exit(0);
} else {
  console.error('\n❌ Some required environment variables are missing');
  process.exit(1);
}
```

```bash
# Ejecutar validación
node scripts/validate-env.js
```

## 🔧 Frontend Configuration

### Development Config

```javascript
// FRONTEND/js/newsletter-config.js
window.NEWSLETTER_CONFIG = {
  // Development URLs
  STRAPI_URL: 'http://localhost:1337',
  
  // EmailJS (same for dev and prod)
  EMAILJS_PUBLIC_KEY: 'fjE9Qo5zVa2mfHE4m',
  EMAILJS_SERVICE_ID: 'service_dk8fe1s',
  EMAILJS_TEMPLATE_ID: 'template_8xeecee',
  
  // Debug mode
  DEBUG: true
};
```

### Production Config

```javascript
// FRONTEND/js/newsletter-config.js
window.NEWSLETTER_CONFIG = {
  // Production URLs
  STRAPI_URL: 'https://ashlar-house-backend.onrender.com',
  
  // EmailJS (same for dev and prod)
  EMAILJS_PUBLIC_KEY: 'fjE9Qo5zVa2mfHE4m',
  EMAILJS_SERVICE_ID: 'service_dk8fe1s',
  EMAILJS_TEMPLATE_ID: 'template_8xeecee',
  
  // Debug mode off
  DEBUG: false
};
```

## 📋 Quick Setup Scripts

### Development Setup

```bash
#!/bin/bash
# setup-development.sh

echo "🏗️ Setting up Ashlar House for development..."

# Copy environment template
cp BACKEND/.env.example BACKEND/.env

echo "✅ Environment template copied"
echo "📝 Please edit BACKEND/.env with your configuration"
echo "🔑 Run 'node generate-secrets.js' to generate secure secrets"

# Install dependencies
cd BACKEND
npm install

echo "🎉 Development setup complete!"
echo "▶️ Run 'npm run develop' to start the development server"
```

### Production Setup

```bash
#!/bin/bash
# setup-production.sh

echo "🚀 Setting up Ashlar House for production..."

# Validate environment
node scripts/validate-env.js

if [ $? -eq 0 ]; then
  echo "✅ Environment validation passed"
  
  # Build for production
  npm run build
  
  echo "🎉 Production setup complete!"
  echo "▶️ Run 'npm start' to start the production server"
else
  echo "❌ Environment validation failed"
  echo "📝 Please configure all required environment variables"
  exit 1
fi
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Invalid APP_KEYS Format
```bash
Error: Invalid app keys format
Solution: Ensure APP_KEYS contains exactly 4 comma-separated base64 strings
```

#### 2. Database Connection Failed
```bash
Error: Database connection failed
Solution: Verify DATABASE_* variables and database server status
```

#### 3. CORS Errors
```bash
Error: CORS policy blocks request
Solution: Add frontend domain to CORS_ORIGINS or middlewares.ts
```

#### 4. CallMeBot API Fails
```bash
Error: WhatsApp message not sent
Solution: Verify CALLMEBOT_API_KEY_* values and phone registration
```

### Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env)" | grep -E "(STRAPI|CALL|EMAIL)"

# Test database connection
npm run strapi console
# Then: strapi.db.connection.raw('SELECT 1')

# Test APIs
curl http://localhost:1337/api/newsletter-subscribers
```
