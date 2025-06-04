# Implementación Completa del Sistema de Notificaciones WhatsApp

## ✅ Lo que se ha implementado

### 1. Sistema de Notificaciones Automáticas
- **Archivo**: `BACKEND/src/api/booking/content-types/booking/lifecycles.js`
- **Funcionalidad**: Envía automáticamente mensajes de WhatsApp cuando se crea una nueva reserva
- **Trigger**: Se ejecuta después de crear cualquier entrada en la colección `bookings`

### 2. Integración con CallMeBot API
- **Servicio**: CallMeBot WhatsApp API (gratuito, hasta 100 mensajes/día)
- **Números configurados**: 
  - 521-811-993-6655
  - 521-811-175-5533
- **Variable de entorno**: `CALLMEBOT_API_KEY` en `.env`

### 3. Formato de Mensajes Personalizado
Según los requerimientos exactos de `Lo que sigue.md`:

#### Para estado "Bloqueado":
```
Se ha bloqueado el día DD/MM/YYYY desde [source]
Se han bloqueado los días DD/MM/YYYY al DD/MM/YYYY desde [source]
```

#### Para estado "Reservado":
```
Se ha reservado el día DD/MM/YYYY desde [source]

Con los siguientes datos de reservación:
Nombre: [name]
Número de huéspedes: [guest]
Teléfono: [phone]
E-mail: [email]
Mensaje del huésped: [message]
```

### 4. Archivos de Configuración
- ✅ `BACKEND/.env` - Variables de entorno actualizadas
- ✅ `BACKEND/.env.example` - Plantilla para producción
- ✅ `render.yaml` - Configuración para despliegue automático
- ✅ `WHATSAPP-SETUP.md` - Documentación completa de configuración

### 5. Scripts de Prueba
- ✅ `BACKEND/scripts/test-whatsapp.js` - Prueba completa del sistema
- ✅ `BACKEND/scripts/simple-test.js` - Verificación básica

## 🚀 Pasos para Activar el Sistema

### Paso 1: Configurar CallMeBot (IMPORTANTE)
```bash
# Para CADA número que recibirá notificaciones:
# Enviar desde WhatsApp al +34 613 00 20 27:
"I allow callmebot to send me messages"

# Guardar la API key que recibas
```

### Paso 2: Actualizar Variables de Entorno
```bash
# En BACKEND/.env, reemplazar:
CALLMEBOT_API_KEY=your_callmebot_api_key_here
# Por tu API key real:
CALLMEBOT_API_KEY=123456
```

### Paso 3: Reiniciar Strapi
```bash
cd BACKEND
npm run develop
```

### Paso 4: Probar el Sistema
```bash
# Opción A: Script de prueba
node scripts/test-whatsapp.js

# Opción B: Crear reserva desde Admin Panel
# http://localhost:1337/admin
# Content Manager → Bookings → Create new entry

# Opción C: API REST
curl -X POST http://localhost:1337/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Test Booking",
      "start": "2025-06-10",
      "end": "2025-06-10",
      "estado": "Reservado",
      "source": "Landing page",
      "name": "Juan Pérez",
      "guest": "2"
    }
  }'
```

## 📋 Checklist de Verificación

- [ ] CallMeBot configurado para ambos números
- [ ] API key añadida al archivo `.env`
- [ ] Strapi funcionando sin errores
- [ ] Logs muestran: "Notificación WhatsApp enviada"
- [ ] Mensajes recibidos en WhatsApp
- [ ] Formato de mensajes correcto

## 🔧 Solución de Problemas

### Error: "CALLMEBOT_API_KEY no está configurada"
```bash
# Verificar archivo .env
cat BACKEND/.env | grep CALLMEBOT

# Reiniciar servidor
npm run develop
```

### Error: "Phone number not authorized"
```bash
# Cada número debe enviar autorización a CallMeBot
# 521-811-993-6655 → Enviar: "I allow callmebot to send me messages"
# 521-811-175-5533 → Enviar: "I allow callmebot to send me messages"
```

### No se reciben mensajes
```bash
# Verificar logs de Strapi
# Buscar: "Enviando WhatsApp a 5218119936655"
# Buscar: "WhatsApp enviado exitosamente"
```

## 🌐 Despliegue en Producción

### Render.com (Recomendado)
```bash
# 1. Subir código a GitHub
git add .
git commit -m "Implement WhatsApp notifications"
git push origin main

# 2. Conectar repositorio en Render.com
# 3. El archivo render.yaml configurará automáticamente:
#    - Base de datos PostgreSQL
#    - Backend Strapi
#    - Frontend estático
#    - Variables de entorno

# 4. Configurar manualmente en Render dashboard:
CALLMEBOT_API_KEY=tu_api_key_real
```

### Configuración Manual
Si no usas el `render.yaml`, configurar:
- **Database**: PostgreSQL
- **Environment**: Node.js
- **Build Command**: `cd BACKEND && npm ci && npm run build`
- **Start Command**: `cd BACKEND && npm start`
- **Environment Variables**: Todas las del `.env`

## 📊 Monitoreo

### Logs de Strapi
```bash
# Desarrollo
npm run develop | grep -i whatsapp

# Producción (Render)
# Ver logs en dashboard → Service → Logs
```

### Métricas CallMeBot
- Límite diario: ~100 mensajes
- Tiempo de entrega: 1-2 minutos
- Rate limit: 1 mensaje/segundo

## 🔮 Próximos Pasos

1. **Probar sistema completo** con reservas reales
2. **Configurar CallMeBot** para ambos números
3. **Desplegar a producción** usando `render.yaml`
4. **Monitoring** de logs y entregas
5. **Backup** de configuración

---

## 📞 Soporte

Para dudas sobre la implementación:
1. Revisar `WHATSAPP-SETUP.md` para detalles técnicos
2. Verificar logs de Strapi para errores
3. Probar con `scripts/test-whatsapp.js`

**¡El sistema está listo para usar!** 🎉
