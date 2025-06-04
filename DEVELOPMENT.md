# DEVELOPMENT.md - Ashlar House

## Guía de Desarrollo y Arquitectura

### 🏗️ **Arquitectura del Sistema**

#### Frontend
- **Landing Page estática** con JavaScript vanilla
- **Tailwind CSS** para estilos responsivos
- **Integración directa** con APIs de Strapi

#### Backend - Strapi v5 + TypeScript
- **CMS Headless** con APIs REST automáticas
- **Content Types**: Bookings, Testimonios, Configuración
- **Lifecycle Hooks** para notificaciones automáticas
- **TypeScript** para type safety y mejor desarrollo

### 🔧 **Configuración del Entorno de Desarrollo**

#### Requisitos del Sistema
- **Node.js 18+** (Recomendado: 22+)
- **npm** o **yarn**
- **TypeScript** (incluido en Strapi v5)
- **PowerShell** (Windows) o **Bash** (Linux/Mac)

#### Variables de Entorno (.env)
```bash
# Strapi Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS="your-app-keys"
API_TOKEN_SALT="your-token-salt"
ADMIN_JWT_SECRET="your-admin-secret"
TRANSFER_TOKEN_SALT="your-transfer-salt"
JWT_SECRET="your-jwt-secret"

# WhatsApp Notifications (CallMeBot API)
CALLMEBOT_API_KEY_1=4639929    # Para +5218119936655
CALLMEBOT_API_KEY_2=1855584    # Para +5218111755533

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### 🚀 **Comandos de Desarrollo**

#### Iniciar el Backend
```bash
cd BACKEND
npm install                 # Solo la primera vez
npm run develop            # Modo desarrollo con auto-reload
npm run build              # Build para producción
npm run start              # Iniciar en modo producción
```

#### Scripts de Mantenimiento
```bash
# Verificación rápida del sistema completo
node scripts/health-check.js

# Verificar solo conectividad Strapi
node scripts/check-strapi.js

# Test de WhatsApp sin Strapi
node scripts/simple-whatsapp-test.js
```

#### Frontend
```bash
# Usar Live Server en VS Code o cualquier servidor estático
# El frontend se conecta al backend en localhost:1337
```

### 📱 **Sistema de Notificaciones WhatsApp**

#### Arquitectura
```typescript
// src/index.ts - Bootstrap principal
export default {
  async bootstrap({ strapi }) {
    // Configuración de lifecycle hooks
    strapi.db.lifecycles.subscribe({
      models: ['api::booking.booking'],
      async afterCreate(event) {
        // Envío automático de WhatsApp
      }
    });
  }
};
```

#### Flujo de Notificaciones
1. **Usuario crea reserva** → API POST `/api/bookings`
2. **Lifecycle Hook se ejecuta** → `afterCreate` en `src/index.ts`
3. **Formateo de mensaje** → Según estado (Reservado/Bloqueado)
4. **Envío dual** → CallMeBot API a ambos números
5. **Logging completo** → Console logs para debugging

#### Configuración CallMeBot
- **Números registrados**: +5218119936655, +5218111755533
- **API Keys configuradas** en variables de entorno
- **Rate limits**: Respeta los límites de CallMeBot
- **Retry logic**: Implementado para manejo de errores

### 🔍 **Testing y Debugging**

#### Scripts Útiles Activos
```bash
# Verificación completa del sistema
node scripts/health-check.js

# Verificar conectividad con Strapi
node scripts/check-strapi.js

# Test completo del sistema WhatsApp
node scripts/final-simple-test.js

# Test directo de conectividad
node scripts/simple-whatsapp-test.js

# Diagnóstico completo
node scripts/diagnostico-completo.js
```

#### Archivos de Test Archivados
Los archivos experimentales de desarrollo están en `BACKEND/archive-test-files/` para referencia histórica pero ya no son necesarios para el funcionamiento del sistema.

#### Logs de Desarrollo
```typescript
// Al iniciar Strapi, buscar:
🚀 WhatsApp Bootstrap - Configurando lifecycle hooks...

// Al crear reserva, verificar:
🎯 LIFECYCLE HOOK EJECUTADO - Nueva reserva creada!
📝 Booking ID: [number]
📋 Booking obtenido: [estado] [fechas]
📱 Enviando notificaciones WhatsApp...
✅ WhatsApp enviado exitosamente a +5218119936655
✅ WhatsApp enviado exitosamente a +5218111755533
```

### 🏭 **Content Types de Strapi**

#### Booking
```typescript
interface Booking {
  id: number;
  start: string;      // ISO Date
  end: string;        // ISO Date
  estado: 'Reservado' | 'Bloqueado' | 'Disponible';
  source: string;     // 'Landing page', 'Airbnb', etc.
  name?: string;      // Solo para reservas
  guest?: string;     // Número de huéspedes
  phone?: string;     // Teléfono del cliente
  email?: string;     // Email del cliente
  message?: string;   // Mensaje del huésped
}
```

### 🔧 **Troubleshooting Común**

#### Strapi no inicia
```bash
# Verificar Node.js version
node --version  # Debe ser 18+

# Limpiar cache
rm -rf node_modules package-lock.json
npm install

# Verificar puerto
netstat -ano | findstr :1337
```

#### Lifecycle Hooks no se ejecutan
1. **Verificar bootstrap log** al iniciar Strapi
2. **Confirmar archivo** `src/index.ts` guardado
3. **Revisar estado de reserva** (solo Reservado/Bloqueado)
4. **Restart completo** de Strapi

#### WhatsApp no llega
1. **Verificar variables de entorno** cargadas
2. **Confirmar API keys** en CallMeBot
3. **Revisar logs** de error en consola
4. **Test directo** con script de prueba

### 📚 **Recursos y Referencias**

#### Documentación Oficial
- [Strapi v5 Documentation](https://docs.strapi.io/dev-docs/intro)
- [Strapi Lifecycle Hooks](https://docs.strapi.io/dev-docs/backend-customization/database-lifecycle)
- [CallMeBot API Documentation](https://www.callmebot.com/blog/free-api-whatsapp-messages/)

#### TypeScript en Strapi
- [TypeScript Configuration](https://docs.strapi.io/dev-docs/typescript)
- [Content Types with TypeScript](https://docs.strapi.io/dev-docs/backend-customization/models)

### 🚀 **Próximas Mejoras**

#### Sistema de Testing
```bash
# Implementar Jest para tests automatizados
npm install --save-dev jest @types/jest
```

#### Logging Estructurado
```typescript
// Reemplazar console.log con Winston
import winston from 'winston';
```

#### Environment Management
```bash
# Múltiples archivos de entorno
.env.development
.env.production
.env.test
```

#### API Rate Limiting
```typescript
// Implementar rate limiting para APIs externas
// Retry logic más robusto
// Queue system para notificaciones
```

---

## 📝 **Notas de Desarrollo**

### Lecciones Aprendidas
1. **Strapi v5** requiere TypeScript para funcionalidad avanzada
2. **Lifecycle hooks** en `src/index.ts` > middlewares HTTP
3. **Bootstrap hooks** son más confiables que archivos separados
4. **CallMeBot API** es estable pero requiere manejo de errores

### Convenciones del Proyecto
- **Commits semánticos**: `feat:`, `fix:`, `docs:`, `refactor:`
- **Branching**: `feature/`, `hotfix/`, `docs/`
- **TypeScript strict mode** habilitado
- **Console logs** descriptivos con emojis para debugging

---

*Este documento se actualizará conforme evolucione el proyecto.*
