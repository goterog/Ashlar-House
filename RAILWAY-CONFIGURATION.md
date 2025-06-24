# Railway Configuration Guide

## Variables de Entorno Críticas

### 1. Variables que Railway configura automáticamente:
- `RAILWAY_PROJECT_ID` - ID del proyecto
- `RAILWAY_SERVICE_ID` - ID del servicio
- `RAILWAY_ENVIRONMENT_ID` - ID del ambiente
- `DATABASE_URL` - URL de PostgreSQL (auto-generada) **CRÍTICA: Debe estar disponible durante build**

**⚠️ IMPORTANTE**: Después de conectar PostgreSQL, debes configurar manualmente:
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 2. Variables que DEBES configurar manualmente en Railway:

#### Variables de Seguridad (OBLIGATORIAS):
```bash
APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT="random-string-32-chars"
ADMIN_JWT_SECRET="random-string-32-chars"
TRANSFER_TOKEN_SALT="random-string-32-chars"
JWT_SECRET="random-string-32-chars"
ENCRYPTION_KEY="random-string-32-chars"
```

#### Variables de Configuración:
```bash
NODE_ENV="production"
HOST="0.0.0.0"
PORT=3000
```

**IMPORTANTE sobre PORT:**
- Railway asigna automáticamente un puerto interno
- Si configuras PORT manualmente, debe ser un NÚMERO (ej: 3000)
- NO uses comillas ni referencias (❌ "$PORT", ❌ "${PORT}")
- Usa solo el número: ✅ 3000

#### Variables Opcionales:
```bash
FRONTEND_URL="https://tu-frontend.com"
WEBHOOKS_POPULATE_RELATIONS=false
```

## Pasos para Configurar en Railway:

### PASO 1: Conectar PostgreSQL
1. Ve a tu proyecto en Railway
2. Clic en "Add Service" → "Database" → "PostgreSQL"
3. Espera a que se cree la base de datos

### PASO 2: Configurar DATABASE_URL
1. Ve al servicio de tu backend (no la base de datos)
2. Selecciona "Variables" tab
3. **CRÍTICO**: Agrega manualmente:
   - Nombre: `DATABASE_URL`
   - Valor: `${{Postgres.DATABASE_URL}}`

### PASO 3: Configurar Variables de Seguridad
4. Agrega cada variable de seguridad:
   - Nombre: `APP_KEYS`
   - Valor: `key1,key2,key3,key4` (genera keys aleatorias)
   - Repite para todas las variables listadas arriba

## Generación de Keys Seguras:

Puedes usar estos comandos para generar keys aleatorias:

```bash
# Para generar una key de 32 caracteres
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# O usar un generador online seguro
```

## Verificación del Deploy:

1. Después de configurar las variables, Railway redesplegará automáticamente
2. Verifica los logs de build y deploy
3. El servidor debería iniciarse en el puerto correcto
4. Verifica que la base de datos PostgreSQL se conecte correctamente

## Solución de Problemas Comunes:

### Error: "PORT variable must be integer between 0 and 65535"
- **Causa**: Variable PORT tiene valor inválido
- **Solución**: Configura PORT=3000 (sin comillas)

### Error: "Database connection failed"
- **Causa**: DATABASE_URL no configurada o inválida
- **Solución**: 
  1. Verifica que el servicio PostgreSQL esté conectado en Railway
  2. La DATABASE_URL debe estar disponible tanto en build como en runtime
  3. Railway genera automáticamente: `${{Postgres.DATABASE_URL}}`

### Error: "DATABASE_URL is required in production"
- **Causa**: DATABASE_URL no disponible durante el build
- **Solución**: 
  1. Ve a Railway Dashboard
  2. Conecta un servicio PostgreSQL
  3. La variable se auto-genera como `${{Postgres.DATABASE_URL}}`
  4. Redeploy automáticamente

### Error: "Invalid APP_KEYS"
- **Causa**: APP_KEYS no configuradas o formato incorrecto
- **Solución**: Configura como string separado por comas: "key1,key2,key3,key4"

## URLs del Proyecto:

- **Backend**: https://tu-servicio-backend.railway.app
- **Admin Panel**: https://tu-servicio-backend.railway.app/admin
- **API**: https://tu-servicio-backend.railway.app/api

## Próximos Pasos:

1. ✅ Configurar todas las variables de entorno listadas arriba
2. ⏳ Esperar a que el deploy automático complete
3. ⏳ Verificar que el servicio esté funcionando
4. ⏳ Crear cuenta de admin en el panel
5. ⏳ Probar el sistema completo con el frontend
