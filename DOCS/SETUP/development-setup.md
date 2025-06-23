# 🛠️ Development Setup Guide - Ashlar House

*Guía completa de configuración de desarrollo - Actualizada: 13 de Junio, 2025*

## 🎯 Requisitos del Sistema

### Software Necesario
- **Node.js 18+** (Recomendado: 22.x LTS)
- **npm 9+** o **yarn 1.22+**
- **Git** para control de versiones
- **VS Code** (recomendado) con extensiones:
  - TypeScript and JavaScript Language Features
  - Strapi Snippets
  - REST Client

### Herramientas Opcionales
- **PowerShell 7+** (Windows) o **Bash** (Linux/Mac)
- **Postman** para testing de APIs
- **SQLite DB Browser** para inspección de base de datos

## 🚀 Configuración Inicial

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/ashlar-house.git
cd ashlar-house
```

### 2. Configurar Backend (Strapi)

#### Instalar Dependencias
```bash
cd BACKEND
npm install
```

#### Configurar Variables de Entorno
```bash
# Copiar template de configuración
cp .env.example .env

# Editar .env con tus credenciales
# Usar editor de texto o IDE
```

#### Variables de Entorno (.env)
```bash
# Strapi Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS="strapi-app-key-1,strapi-app-key-2"
API_TOKEN_SALT="api-token-salt-here"
ADMIN_JWT_SECRET="admin-jwt-secret-here"
TRANSFER_TOKEN_SALT="transfer-token-salt-here"
JWT_SECRET="jwt-secret-here"

# Database (Development)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# WhatsApp Notifications (CallMeBot API)
CALLMEBOT_API_KEY_1=4639929    # Para +5218119936655
CALLMEBOT_API_KEY_2=1855584    # Para +5218111755533

# EmailJS Configuration (Backend)
EMAILJS_PUBLIC_KEY=fjE9Qo5zVa2mfHE4m
EMAILJS_SERVICE_ID=service_dk8fe1s
EMAILJS_TEMPLATE_ID=template_8xeecee

# Admin Email
ADMIN_EMAIL=admin@ashlarhouse.com
```

#### Generar Secretos de Seguridad
```bash
# Generar APP_KEYS aleatorias
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generar API_TOKEN_SALT
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Inicializar Base de Datos

#### Primera Ejecución
```bash
# Iniciar Strapi en modo desarrollo
npm run develop

# Esto creará automáticamente:
# - Base de datos SQLite en .tmp/data.db
# - Tablas para content types
# - Admin panel en http://localhost:1337/admin
```

#### Crear Usuario Administrador
```
1. Abrir http://localhost:1337/admin
2. Crear cuenta de administrador:
   - Email: admin@ashlarhouse.com
   - Password: [contraseña segura]
   - Nombre: Admin Ashlar House
3. Confirmar creación
```

### 4. Configurar Frontend

#### Estructura de Archivos
```bash
cd ../FRONTEND

# Verificar estructura
ls -la
# Debería mostrar:
# - Ashlar House.html
# - campaign-manager.html
# - js/
# - assets/
# - test-*.html
```

#### Configurar Servidor de Desarrollo
```bash
# Opción 1: Live Server (VS Code)
# Instalar extensión Live Server
# Click derecho en Ashlar House.html → "Open with Live Server"

# Opción 2: Python HTTP Server
python -m http.server 8000
# Abrir http://localhost:8000

# Opción 3: Node.js HTTP Server
npx http-server -p 8000
# Abrir http://localhost:8000
```

## 🔧 Comandos de Desarrollo

### Backend (Strapi)
```bash
cd BACKEND

# Desarrollo con auto-reload
npm run develop

# Build para producción
npm run build

# Iniciar en modo producción
npm run start

# Limpiar cache y rebuild
npm run strapi build --clean
```

### Scripts de Utilidad
```bash
# Verificar salud del sistema
node scripts/health-check.js

# Test de WhatsApp sin Strapi
node scripts/simple-whatsapp-test.js

# Test completo del sistema
node test-secure-email-system.js

# Verificar APIs
node scripts/check-strapi.js
```

### Frontend
```bash
cd FRONTEND

# Verificar todas las páginas
# - Ashlar House.html (landing principal)
# - campaign-manager.html (gestión campañas)
# - test-newsletter.html (testing sistema)
```

## 🏗️ Estructura del Proyecto

```
ASHLAR-HOUSE/
├── BACKEND/                     # Strapi v5 + TypeScript
│   ├── .env                     # Variables de entorno (NO subir a Git)
│   ├── .env.example            # Template de configuración
│   ├── package.json            # Dependencias Node.js
│   ├── tsconfig.json           # Configuración TypeScript
│   ├── src/
│   │   ├── index.ts            # 🎯 Bootstrap principal + Lifecycle Hooks
│   │   ├── api/
│   │   │   ├── newsletter-subscriber/  # Content-type suscriptores
│   │   │   │   ├── controllers/
│   │   │   │   ├── routes/
│   │   │   │   └── services/
│   │   │   ├── contact-message/       # Content-type mensajes
│   │   │   └── booking/               # Content-type reservas
│   │   └── extensions/         # Extensiones personalizadas
│   ├── config/                 # Configuración Strapi
│   │   ├── database.ts
│   │   ├── server.ts
│   │   └── middlewares.ts
│   ├── types/                  # Definiciones TypeScript
│   │   └── generated/
│   │       └── contentTypes.d.ts
│   ├── scripts/               # Herramientas de desarrollo
│   │   ├── health-check.js
│   │   ├── check-strapi.js
│   │   └── simple-whatsapp-test.js
│   └── .tmp/                  # Base de datos SQLite (desarrollo)
│       └── data.db
├── FRONTEND/                   # Frontend estático
│   ├── Ashlar House.html      # 🎯 Landing page principal
│   ├── campaign-manager.html  # Gestión de campañas
│   ├── js/
│   │   ├── newsletter.js      # Sistema newsletter completo
│   │   ├── newsletter-config.js # Configuración EmailJS
│   │   ├── campaign-manager.js # Gestión de suscriptores
│   │   └── whatsapp-lists-manager.js # Gestión WhatsApp
│   ├── assets/               # Imágenes y recursos
│   │   ├── images/
│   │   └── icons/
│   └── test-*.html          # Páginas de testing
├── DOCS/                    # 📚 Documentación organizada
│   ├── README.md
│   ├── ARCHITECTURE/
│   ├── API/
│   ├── SETUP/
│   ├── INTEGRATIONS/
│   ├── TESTING/
│   └── HISTORY/
└── render.yaml             # Configuración deployment
```

## 🧪 Testing y Verificación

### 1. Verificar Backend
```bash
cd BACKEND

# Test de conectividad básica
curl http://localhost:1337/admin

# Test de APIs
curl -X GET http://localhost:1337/api/newsletter-subscribers
curl -X GET http://localhost:1337/api/contact-messages
curl -X GET http://localhost:1337/api/bookings

# Test de WhatsApp
node scripts/simple-whatsapp-test.js

# Test completo del sistema
node test-secure-email-system.js
```

### 2. Verificar Frontend
```bash
# Abrir en navegador
http://localhost:8000/Ashlar%20House.html

# Probar funcionalidades:
# ✅ Formulario de contacto
# ✅ Newsletter footer
# ✅ Campaign manager
# ✅ Página de testing
```

### 3. Test End-to-End
```bash
# 1. Backend funcionando en localhost:1337
# 2. Frontend funcionando en localhost:8000
# 3. Llenar formulario de contacto
# 4. Verificar en Strapi admin:
#    - Nuevo contact-message creado
#    - Nuevo newsletter-subscriber (si marcó checkbox)
#    - WhatsApp enviado (si es booking)
#    - Email enviado (EmailJS)
```

## 🔍 Debugging

### Logs de Strapi
```bash
# Ver logs en tiempo real
npm run develop

# Los logs aparecerán en consola:
# [INFO] Server started on http://localhost:1337
# [DEBUG] WhatsApp notification sent
# [ERROR] Database connection failed
```

### Debugging Frontend
```javascript
// Abrir Developer Tools (F12)
// Ir a Console tab
// Ver logs de JavaScript:

console.log('Newsletter system loaded');
console.error('API call failed');
```

### Debugging Base de Datos
```bash
# Usar SQLite browser
sqlite3 BACKEND/.tmp/data.db

# Comandos SQL útiles:
.tables                          # Ver tablas
SELECT * FROM newsletter_subscribers;
SELECT * FROM contact_messages;
SELECT * FROM bookings;
```

## 🛡️ Mejores Prácticas

### Seguridad en Desarrollo
```bash
# 1. Nunca subir .env a Git
echo ".env" >> .gitignore

# 2. Usar secretos únicos para cada entorno
# No reutilizar secretos entre desarrollo/producción

# 3. Validar todas las entradas
# Implementar validación tanto en frontend como backend
```

### Performance
```bash
# 1. Optimizar queries de base de datos
# Usar populate solo cuando necesario

# 2. Implementar caching
# Redis para producción, memoria para desarrollo

# 3. Comprimir assets
# Minificar JavaScript y CSS para producción
```

### Mantenibilidad
```bash
# 1. Seguir convenciones de naming
# kebab-case para archivos
# camelCase para variables JavaScript
# PascalCase para componentes

# 2. Documentar código complejo
# Especialmente lifecycle hooks y API integrations

# 3. Usar TypeScript
# Aprovechar type safety en backend Strapi
```

## 🚨 Solución de Problemas Comunes

### Error: Puerto 1337 ocupado
```bash
# Encontrar proceso usando puerto
netstat -ano | findstr :1337

# Matar proceso (Windows)
taskkill /PID [PID_NUMBER] /F

# Matar proceso (Linux/Mac)
kill -9 [PID_NUMBER]
```

### Error: Base de datos corrupta
```bash
# Eliminar base de datos y recrear
rm BACKEND/.tmp/data.db
npm run develop
# Recrear usuario admin
```

### Error: Dependencias Node.js
```bash
# Limpiar cache npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: WhatsApp no se envía
```bash
# Verificar variables de entorno
node scripts/simple-whatsapp-test.js

# Verificar logs de Strapi
# Buscar mensajes de error de CallMeBot API
```

### Error: EmailJS no funciona
```bash
# Test directo de EmailJS
node test-secure-email-system.js

# Verificar credenciales en .env
# Verificar template ID en EmailJS dashboard
```

## 📊 Monitoring de Desarrollo

### Health Checks Automáticos
```bash
# Script de verificación completa
node scripts/health-check.js

# Salida esperada:
# ✅ Strapi server: Running
# ✅ Database: Connected
# ✅ WhatsApp API: Working
# ✅ EmailJS: Working
```

### Métricas de Desarrollo
```javascript
// Ver estadísticas en tiempo real
// Abrir http://localhost:1337/admin
// Dashboard mostrará:
// - Total de suscriptores
// - Mensajes de contacto
// - Bookings recientes
```

## 🔄 Workflow de Desarrollo

### 1. Desarrollo Diario
```bash
# Iniciar sesión de desarrollo
cd BACKEND && npm run develop &
cd FRONTEND && python -m http.server 8000 &

# Trabajar en archivos
# Strapi auto-reloadea en cambios
# Frontend requiere refresh manual
```

### 2. Testing de Cambios
```bash
# Después de cada cambio importante
node test-secure-email-system.js

# Verificar funcionalidades en navegador
# Probar formularios y integraciones
```

### 3. Commit de Código
```bash
# Verificar que todo funciona
npm run build

# Commit con mensajes descriptivos
git add .
git commit -m "feat: add newsletter email validation"
git push origin development
```
