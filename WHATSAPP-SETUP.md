# Configuración de Notificaciones WhatsApp

## Configuración de CallMeBot

Para recibir notificaciones automáticas de WhatsApp cuando se creen nuevas reservas, necesitas configurar CallMeBot:

### Paso 1: Obtener API Key de CallMeBot

1. Desde tu WhatsApp, envía el siguiente mensaje exacto al número **+34 694 29 84 96**:
   ```
   I allow callmebot to send me messages
   ```

2. Recibirás una respuesta con tu API key personal. Ejemplo:
   ```
   CallMeBot: Your API key is: 123456
   ```

### Paso 2: Configurar la Variable de Entorno

1. Abre el archivo `.env` en el directorio `BACKEND/`
2. Reemplaza `your_callmebot_api_key_here` con tu API key real:
   ```
   CALLMEBOT_API_KEY=123456
   ```

### Paso 3: Registrar Números de Destino

Los números configurados para recibir notificaciones son:
- 521-811-993-6655
- 521-811-175-5533

**Importante**: Cada número debe haber enviado el mensaje "I allow callmebot to send me messages" al bot de CallMeBot para poder recibir mensajes.

## Funcionamiento del Sistema

### Cuándo se Envían Notificaciones

Las notificaciones se envían automáticamente cuando:
- Se crea una nueva entrada en `api/bookings`
- El campo `estado` es "Bloqueado" o "Reservado"
- Los estados "Disponible" NO generan notificaciones

### Formato de Mensajes

#### Para Reservas Bloqueadas:
```
Se ha bloqueado el día DD/MM/YYYY desde [source]
```
o
```
Se han bloqueado los días DD/MM/YYYY al DD/MM/YYYY desde [source]
```

#### Para Reservas Confirmadas:
```
Se ha reservado el día DD/MM/YYYY desde [source]

Con los siguientes datos de reservación:
Nombre: [name]
Número de huéspedes: [guest]
Teléfono: [phone]
E-mail: [email]
Mensaje del huésped: [message]
```

## Probar el Sistema

### Opción 1: Crear Reserva desde Strapi Admin

1. Accede a tu panel de Strapi: `http://localhost:1337/admin`
2. Ve a Content Manager → Bookings
3. Crea una nueva entrada con:
   - **start**: Fecha de inicio
   - **end**: Fecha de fin
   - **estado**: "Reservado" o "Bloqueado"
   - **source**: "Landing page", "Airbnb", etc.
   - Campos opcionales: name, guest, phone, email, message

### Opción 2: Crear Reserva via API

```bash
curl -X POST http://localhost:1337/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Test Booking",
      "start": "2025-06-10",
      "end": "2025-06-12",
      "estado": "Reservado",
      "source": "Landing page",
      "name": "Juan Pérez",
      "guest": "2",
      "phone": "+52-811-123-4567",
      "email": "juan@example.com",
      "message": "Vacaciones familiares"
    }
  }'
```

## Solución de Problemas

### Verificar Logs

Revisa los logs de Strapi para ver si las notificaciones se están enviando:

```bash
# En el directorio BACKEND/
npm run develop
```

Busca mensajes como:
- `Enviando WhatsApp a 5218119936655: Se ha reservado...`
- `WhatsApp enviado exitosamente a 5218119936655`
- `Error enviando WhatsApp: [error message]`

### Errores Comunes

1. **"CALLMEBOT_API_KEY no está configurada"**
   - Verifica que el archivo `.env` contenga la API key correcta
   - Reinicia el servidor de Strapi después de cambiar el `.env`

2. **"Error 400: Invalid API key"**
   - Confirma que la API key es correcta
   - Verifica que el número que obtuvo la API key coincida con uno de los destinatarios

3. **"Error 403: Phone number not authorized"**
   - El número de destino debe enviar el mensaje de autorización a CallMeBot
   - Cada número debe hacer este proceso individualmente

### Comandos Útiles

```bash
# Reiniciar servidor Strapi
npm run develop

# Ver logs en tiempo real
npm run develop | grep -i whatsapp

# Verificar variables de entorno
node -e "console.log(process.env.CALLMEBOT_API_KEY)"
```

## Limitaciones de CallMeBot

- Límite de ~100 mensajes por día por API key
- Cada número debe autorizar individualmente a CallMeBot
- No soporta archivos multimedia, solo texto
- Puede tener retrasos de 1-2 minutos en la entrega

## Alternativas Futuras

Para mayor volumen o funcionalidades avanzadas, considera:
- Twilio WhatsApp API (pago)
- Meta WhatsApp Business API (pago)
- Webhook personalizado con integración directa
