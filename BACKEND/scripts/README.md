# Scripts de Desarrollo - Ashlar House

## 🎯 Scripts Principales

### Script Maestro
- **`dev-tools.js`** - Herramienta unificada para todas las tareas de desarrollo
  ```bash
  node scripts/dev-tools.js help          # Ver comandos disponibles
  node scripts/dev-tools.js health-check  # Verificación completa
  node scripts/dev-tools.js test-whatsapp # Test WhatsApp
  ```

### Verificaciones del Sistema
- **`health-check.js`**       - Verificación completa del sistema (Strapi + WhatsApp + Env)
- **`pre-deploy-check.js`**   - Verificación pre-despliegue para producción
- **`check-strapi.js`**       - Verificar solo conectividad con Strapi

### Testing WhatsApp
- **`Whatsapp vía callmebot/health-check.js`**          - Verificación rápida del sistema WhatsApp
- **`Whatsapp vía callmebot/whatsapp-test-complete.js`** - Script unificado con 4 modos (demo, test, diagnostic, simulate)

### Utilidades de Desarrollo
- **`import-airbnb-calendar.js`** - Importar calendario de Airbnb
- **`seed.js`**                   - Poblar base de datos con datos de prueba

## 🚀 Cómo Usar

### Via NPM Scripts (Recomendado)
```bash
# Desde el directorio BACKEND
npm run health-check    # Verificación completa del sistema
npm run pre-deploy      # Check antes de desplegar
npm run dev-tools       # Script maestro con menú
npm run check:strapi    # Solo verificar Strapi

# WhatsApp scripts específicos
node "scripts/Whatsapp vía callmebot/health-check.js"
node "scripts/Whatsapp vía callmebot/whatsapp-test-complete.js" demo
```

### Via Node Directo
```bash
# Desde el directorio BACKEND
node scripts/health-check.js
node scripts/pre-deploy-check.js
node scripts/dev-tools.js help

# Scripts WhatsApp unificados
node "scripts/Whatsapp vía callmebot/health-check.js"
node "scripts/Whatsapp vía callmebot/whatsapp-test-complete.js" help
```

### Workflow Recomendado
```bash
# 1. Verificación diaria de desarrollo
npm run health-check

# 2. Antes de hacer commit
npm run pre-deploy

# 3. Verificación específica de WhatsApp
node "scripts/Whatsapp vía callmebot/health-check.js"

# 4. Test completo de WhatsApp (demo/test/diagnostic/simulate)
node "scripts/Whatsapp vía callmebot/whatsapp-test-complete.js" demo

# 5. Troubleshooting completo
node "scripts/Whatsapp vía callmebot/whatsapp-test-complete.js" diagnostic
```

## 📝 Notas de Desarrollo

- Los scripts están diseñados para Node.js 18+
- Requieren que las variables de entorno estén configuradas
- Algunos scripts requieren que Strapi esté ejecutándose

## 🗂️ Archivos Archivados

Los archivos de test y desarrollo experimental están en `../archive-test-files/` para referencia histórica pero no son necesarios para el funcionamiento del sistema.

### Scripts WhatsApp Archivados
Los siguientes scripts fueron unificados en el sistema `Whatsapp vía callmebot/`:
- `demo-whatsapp.js` → `whatsapp-test-complete.js demo`
- `diagnostico-completo.js` → `whatsapp-test-complete.js diagnostic`  
- `simulate-lifecycle.js` → `whatsapp-test-complete.js simulate`
- `verificacion-final.js` → `health-check.js`

Ver `scripts/Whatsapp vía callmebot/README.md` para documentación completa del sistema unificado.
