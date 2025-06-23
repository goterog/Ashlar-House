# 📱 WhatsApp Integration Setup - CallMeBot API

*Configuración completa de notificaciones WhatsApp - Ashlar House*

## 🎯 Resumen

El sistema de notificaciones WhatsApp utiliza **CallMeBot API** para enviar automáticamente notificaciones a dos números telefónicos cuando se crean nuevas reservas o bloqueos en el calendario.

## 🔧 Configuración Inicial

### 1. Registrar Números con CallMeBot

Cada número que desee recibir notificaciones debe:

1. **Enviar mensaje de autorización** a CallMeBot:
   - Número de CallMeBot: **+34 694 29 84 96**
   - Mensaje exacto: `I allow callmebot to send me messages`

2. **Recibir API Key personal**:
   ```
   CallMeBot: Your API key is: 4639929
   ```

3. **Guardar la API Key** para configuración

### 2. Números Configurados

#### Número Principal: +52 811 993 6655
- API Key: `4639929`
- Variable: `CALLMEBOT_API_KEY_1`

#### Número Secundario: +52 811 175 5533  
- API Key: `1855584`
- Variable: `CALLMEBOT_API_KEY_2`

### 3. Variables de Entorno

```bash
# BACKEND/.env
CALLMEBOT_API_KEY_1=4639929    # Para +5218119936655
CALLMEBOT_API_KEY_2=1855584    # Para +5218111755533
```

## 🏗️ Arquitectura del Sistema

### Lifecycle Hook Implementation
```typescript
// BACKEND/src/index.ts
export default {
  async bootstrap({ strapi }) {
    // Configuración de lifecycle hooks
    strapi.db.lifecycles.subscribe({
      models: ['api::booking.booking'],
      
      async afterCreate(event) {
        const { result } = event;
        await sendWhatsAppNotification(result);
      }
    });
  }
};
```

### Función de Notificación
```typescript
const sendWhatsAppNotification = async (booking) => {
  if (!booking.status || booking.status === 'Disponible') {
    return; // No enviar para disponibles
  }

  const message = formatMessage(booking);
  
  // Enviar a ambos números
  await Promise.all([
    sendToPhone(process.env.CALLMEBOT_API_KEY_1, '+5218119936655', message),
    sendToPhone(process.env.CALLMEBOT_API_KEY_2, '+5218111755533', message)
  ]);
};
```

## 📨 Formato de Mensajes

### Mensaje para Reservas
```
🏠 NUEVA RESERVA - Ashlar House

👤 Huésped: [guest_name]
📧 Email: [email]  
📱 Teléfono: [phone]
📅 Check-in: [check_in]
📅 Check-out: [check_out]
👥 Huéspedes: [guests]

Estado: ✅ RESERVADO
Fecha: [timestamp]
```

### Mensaje para Bloqueos
```
🔒 BLOQUEO DE CALENDARIO - Ashlar House

📅 Fecha: [check_in] - [check_out]
📝 Motivo: Bloqueo administrativo

Estado: ❌ BLOQUEADO  
Fecha: [timestamp]
```

## 🔌 API CallMeBot

### Endpoint
```
GET https://api.callmebot.com/whatsapp.php
```

### Parámetros
```javascript
{
  phone: '+5218119936655',    // Número de destino
  text: 'Mensaje a enviar',   // Mensaje URL-encoded
  apikey: '4639929'           // API Key del número
}
```

### Ejemplo de Request
```javascript
const sendWhatsAppMessage = async (apiKey, phone, message) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    if (response.ok) {
      console.log(`✅ WhatsApp sent to ${phone}: ${text}`);
    } else {
      console.error(`❌ WhatsApp failed to ${phone}: ${text}`);
    }
  } catch (error) {
    console.error(`❌ Network error for ${phone}:`, error);
  }
};
```

## 🧪 Testing

### Script de Prueba Manual
```javascript
// BACKEND/test-whatsapp.js
const testWhatsApp = async () => {
  const testMessage = `🧪 TEST MESSAGE - Ashlar House
  
📅 Fecha: ${new Date().toLocaleString()}
🔧 Tipo: Prueba del sistema
✅ Estado: Funcionando correctamente`;

  // Test ambos números
  await sendWhatsAppMessage(
    process.env.CALLMEBOT_API_KEY_1, 
    '+5218119936655', 
    testMessage
  );
  
  await sendWhatsAppMessage(
    process.env.CALLMEBOT_API_KEY_2, 
    '+5218111755533', 
    testMessage
  );
};

testWhatsApp();
```

### Verificación de Configuración
```javascript
// BACKEND/scripts/verify-whatsapp.js
const verifyWhatsAppConfig = () => {
  console.log('🔍 Verificando configuración WhatsApp...');
  
  const key1 = process.env.CALLMEBOT_API_KEY_1;
  const key2 = process.env.CALLMEBOT_API_KEY_2;
  
  if (!key1 || !key2) {
    console.error('❌ API Keys de CallMeBot no configuradas');
    return false;
  }
  
  console.log('✅ API Key 1:', key1 ? 'Configurada' : 'Faltante');
  console.log('✅ API Key 2:', key2 ? 'Configurada' : 'Faltante');
  
  return true;
};
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Mensaje no recibido
```
Verificar:
- ✅ Número registrado con CallMeBot
- ✅ API Key correcta en .env
- ✅ Número en formato internacional (+52...)
- ✅ WhatsApp instalado y activo
```

#### 2. Error de API
```javascript
// Error típico: API key inválida
{
  "error": "API key not found or invalid"
}

// Solución: Re-registrar número con CallMeBot
```

#### 3. Mensaje truncado
```
Problema: Mensaje muy largo (>1600 caracteres)
Solución: Usar formatMessage() para limitar longitud
```

### Logs de Debugging
```javascript
// BACKEND/src/index.ts
const sendWhatsAppNotification = async (booking) => {
  console.log('📱 Iniciando notificación WhatsApp...');
  console.log('📊 Booking data:', JSON.stringify(booking, null, 2));
  
  const message = formatMessage(booking);
  console.log('📝 Mensaje formateado:', message);
  
  // Envío con logging detallado
  const results = await Promise.allSettled([
    sendToPhone(process.env.CALLMEBOT_API_KEY_1, '+5218119936655', message),
    sendToPhone(process.env.CALLMEBOT_API_KEY_2, '+5218111755533', message)
  ]);
  
  results.forEach((result, index) => {
    const phone = index === 0 ? '+5218119936655' : '+5218111755533';
    if (result.status === 'fulfilled') {
      console.log(`✅ WhatsApp enviado a ${phone}`);
    } else {
      console.error(`❌ Error enviando a ${phone}:`, result.reason);
    }
  });
};
```

## 🔐 Seguridad

### Mejores Prácticas

1. **Variables de Entorno**
   ```bash
   # Nunca hardcodear API keys
   ❌ const apiKey = '4639929';
   ✅ const apiKey = process.env.CALLMEBOT_API_KEY_1;
   ```

2. **Validación de Entrada**
   ```javascript
   const validateMessage = (message) => {
     if (!message || message.length > 1600) {
       throw new Error('Mensaje inválido');
     }
     return message.replace(/[<>]/g, ''); // Sanitizar
   };
   ```

3. **Rate Limiting**
   ```javascript
   // Evitar spam - máximo 1 mensaje por minuto por número
   const rateLimiter = new Map();
   
   const canSendMessage = (phone) => {
     const lastSent = rateLimiter.get(phone);
     const now = Date.now();
     
     if (lastSent && (now - lastSent) < 60000) {
       return false;
     }
     
     rateLimiter.set(phone, now);
     return true;
   };
   ```

## 📊 Monitoring

### Métricas de Entrega
```javascript
// BACKEND/src/utils/whatsapp-analytics.js
class WhatsAppAnalytics {
  static stats = {
    sent: 0,
    failed: 0,
    byPhone: {}
  };
  
  static recordSent(phone) {
    this.stats.sent++;
    this.stats.byPhone[phone] = (this.stats.byPhone[phone] || 0) + 1;
  }
  
  static recordFailed(phone) {
    this.stats.failed++;
  }
  
  static getStats() {
    return this.stats;
  }
}
```

### Health Check
```javascript
// BACKEND/scripts/whatsapp-health.js
const checkWhatsAppHealth = async () => {
  try {
    const testMessage = '🏥 Health Check - ' + new Date().toISOString();
    
    const response = await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=+5218119936655&text=${encodeURIComponent(testMessage)}&apikey=${process.env.CALLMEBOT_API_KEY_1}`
    );
    
    if (response.ok) {
      console.log('✅ WhatsApp API está funcionando');
      return true;
    } else {
      console.error('❌ WhatsApp API no responde');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en health check:', error);
    return false;
  }
};
```

## 🔄 Backup y Recuperación

### Configuración de Respaldo
```bash
# Respaldar configuración WhatsApp
cp BACKEND/.env BACKEND/.env.backup

# Documentar API Keys en lugar seguro
echo "CALLMEBOT_API_KEY_1=4639929" >> secure-config.txt
echo "CALLMEBOT_API_KEY_2=1855584" >> secure-config.txt
```

### Recuperación de Servicio
```javascript
// Si CallMeBot falla, implementar fallback
const sendWithFallback = async (phone, message) => {
  try {
    await sendWhatsAppMessage(apiKey, phone, message);
  } catch (error) {
    console.error('WhatsApp falló, usando email backup...');
    await sendEmailBackup(phone, message);
  }
};
```
