# Scripts de Desarrollo - Ashlar House

# Scripts de Desarrollo - Ashlar House

## 🎯 Scripts Principales

### Script Maestro
- **`dev-tools.js`** - Herramienta unificada para todas las tareas de desarrollo
  ```bash
  node scripts/dev-tools.js help           # Ver comandos disponibles
  node scripts/dev-tools.js health-check  # Verificación completa
  node scripts/dev-tools.js test-whatsapp # Test WhatsApp
  ```

### Verificaciones del Sistema
- **`health-check.js`** - Verificación completa del sistema (Strapi + WhatsApp + Env)
- **`pre-deploy-check.js`** - Verificación pre-despliegue para producción
- **`check-strapi.js`** - Verificar solo conectividad con Strapi

### Testing WhatsApp
- **`demo-whatsapp.js`** - Test directo de WhatsApp API
- **`simulate-lifecycle.js`** - Simular lifecycle hooks sin Strapi

### Utilidades de Desarrollo
- **`diagnostico-completo.js`** - Diagnóstico detallado del sistema
- **`import-airbnb-calendar.js`** - Importar calendario de Airbnb
- **`seed.js`** - Poblar base de datos con datos de prueba

## 🚀 Cómo Usar

### Via NPM Scripts (Recomendado)
```bash
# Desde el directorio BACKEND
npm run health-check    # Verificación completa del sistema
npm run pre-deploy      # Check antes de desplegar
npm run dev-tools       # Script maestro con menú
npm run test:whatsapp   # Test directo WhatsApp
npm run check:strapi    # Solo verificar Strapi
```

### Via Node Directo
```bash
# Desde el directorio BACKEND
node scripts/health-check.js
node scripts/pre-deploy-check.js
node scripts/dev-tools.js help
node scripts/demo-whatsapp.js
node scripts/diagnostico-completo.js
```

### Workflow Recomendado
```bash
# 1. Verificación diaria de desarrollo
npm run health-check

# 2. Antes de hacer commit
npm run pre-deploy

# 3. Test específico de WhatsApp
npm run test:whatsapp

# 4. Troubleshooting completo
node scripts/diagnostico-completo.js
```

## 📝 Notas de Desarrollo

- Los scripts están diseñados para Node.js 18+
- Requieren que las variables de entorno estén configuradas
- Algunos scripts requieren que Strapi esté ejecutándose

## 🗂️ Archivos Archivados

Los archivos de test y desarrollo experimental están en `../archive-test-files/` para referencia histórica pero no son necesarios para el funcionamiento del sistema.
