# Scripts WhatsApp - Ashlar House

Este directorio contiene los scripts unificados para el sistema de notificaciones WhatsApp de Ashlar House.

## 📋 Scripts Disponibles

### 1. `health-check.js` - Verificación Rápida
**Propósito:** Chequeo básico y rápido del sistema
```bash
node health-check.js
```

**¿Qué verifica?**
- ✅ Variables de entorno (API keys)
- ✅ Conectividad con Strapi 
- ✅ API de WhatsApp básica

**Cuándo usar:** Para verificaciones diarias o antes de trabajar en el sistema.

---

### 2. `whatsapp-test-complete.js` - Script Completo
**Propósito:** Herramienta completa que unifica todas las funciones de test, demo, diagnóstico y simulación.

#### Comandos disponibles:

```bash
# Ver ayuda
node whatsapp-test-complete.js help

# Demo sin envío real
node whatsapp-test-complete.js demo

# Test real de API
node whatsapp-test-complete.js test

# Diagnóstico completo
node whatsapp-test-complete.js diagnostic

# Simulación del lifecycle
node whatsapp-test-complete.js simulate
```

## 🔧 Modo de Uso Recomendado

### Para desarrollo diario:
```bash
# 1. Verificación rápida
node health-check.js

# 2. Si hay problemas, diagnóstico completo
node whatsapp-test-complete.js diagnostic
```

### Para testing:
```bash
# 1. Demo (sin envío real)
node whatsapp-test-complete.js demo

# 2. Test real
node whatsapp-test-complete.js test
```

### Para troubleshooting:
```bash
# Diagnóstico completo
node whatsapp-test-complete.js diagnostic
```

### Para simular el sistema completo:
```bash
# Simulación del lifecycle con envío real
node whatsapp-test-complete.js simulate
```

## 📦 Scripts Reemplazados

Este nuevo sistema unificado reemplaza a los siguientes scripts archivados:

- `demo-whatsapp.js` → `whatsapp-test-complete.js demo`
- `diagnostico-completo.js` → `whatsapp-test-complete.js diagnostic`
- `simulate-lifecycle.js` → `whatsapp-test-complete.js simulate`
- `verificacion-final.js` → `health-check.js`

## ⚙️ Configuración Requerida

### Variables de entorno (.env):
```bash
CALLMEBOT_API_KEY_1=4639929
CALLMEBOT_API_KEY_2=1855584
```

### Registro en CallMeBot:
Cada número debe enviar el mensaje:
```
"I allow callmebot to send me messages"
```
Al número: **+34 613 00 20 27**

### Números configurados:
- **+52-81-1993-6655** (API Key: 4639929)
- **+52-81-1175-5533** (API Key: 1855584)

## 🚀 Flujo de Trabajo

### 1. Verificación inicial
```bash
node health-check.js
```

### 2. Si todo está OK, probar con demo
```bash
node whatsapp-test-complete.js demo
```

### 3. Test real (opcional)
```bash
node whatsapp-test-complete.js test
```

### 4. Si hay problemas, diagnóstico
```bash
node whatsapp-test-complete.js diagnostic
```

## 📱 Funcionamiento del Sistema

1. **Strapi** detecta nueva reserva (estado: "Reservado" o "Bloqueado")
2. **Lifecycle hook** se ejecuta automáticamente
3. **WhatsApp API** envía notificaciones a ambos números
4. **Mensajes** llegan en 1-3 minutos

## 🔍 Troubleshooting

### No llegan mensajes:
1. Verificar que los números estén registrados en CallMeBot
2. Comprobar API keys en .env
3. Revisar logs de Strapi
4. Ejecutar diagnóstico completo

### Errores comunes:
- **"API key no configurada"** → Revisar archivo .env
- **"Phone number not authorized"** → Registrar número en CallMeBot
- **"Error 404"** → Número no registrado
- **"Timeout"** → Problema de conectividad

## 📖 Documentación Adicional

- `WHATSAPP-SETUP.md` - Configuración detallada
- `WHATSAPP-IMPLEMENTACION.md` - Implementación técnica
- `DEVELOPMENT.md` - Guía de desarrollo

---

**✨ ¡Sistema listo para producción!** 🏠
