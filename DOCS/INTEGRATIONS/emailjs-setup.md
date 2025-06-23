# 📧 EmailJS Integration Setup

*Configuración completa de EmailJS para sistema de newsletter - Ashlar House*

## 🎯 Resumen

EmailJS permite enviar emails directamente desde el frontend sin necesidad de un servidor de email backend. Se utiliza para:
- Confirmaciones de suscripción al newsletter
- Notificaciones de mensajes de contacto
- Emails automáticos de respuesta

## 🚀 Configuración Inicial

### 1. Crear Cuenta EmailJS

1. **Registrarse**: [https://www.emailjs.com/](https://www.emailjs.com/)
2. **Plan gratuito**: 200 emails/mes incluidos
3. **Verificar email** de confirmación

### 2. Configurar Servicio de Email

#### Opción A: Gmail (Recomendado)
```
1. Dashboard → Email Services → Add New Service
2. Seleccionar "Gmail"
3. Conectar cuenta de Google
4. Autorizar acceso a EmailJS
5. Copiar Service ID: "service_xxxxxxx"
```

#### Opción B: Outlook/Hotmail
```
1. Email Services → Add New Service
2. Seleccionar "Outlook"
3. Ingresar credenciales
4. Copiar Service ID
```

#### Opción C: SMTP Personalizado
```
1. Email Services → Add New Service
2. Seleccionar "Custom SMTP"
3. Configurar:
   - SMTP Host: smtp.tuproveedor.com
   - Port: 587 (TLS) o 25
   - Username: tu-email@dominio.com
   - Password: tu-contraseña
```

### 3. Crear Templates de Email

#### Template 1: Confirmación Newsletter
```html
Subject: ¡Bienvenido al Newsletter de Ashlar House! 🏠

Hola {{to_name}},

¡Gracias por suscribirte a nuestro newsletter!

✅ Email confirmado: {{to_email}}
📱 WhatsApp: {{whatsapp_subscription}}
📅 Fecha de suscripción: {{subscription_date}}

Recibirás las mejores ofertas y novedades de Ashlar House.

¡Esperamos verte pronto!

---
Ashlar House - Tu refugio en la naturaleza
ashlarhouse.com
```

#### Template 2: Notificación Contacto
```html
Subject: Nuevo mensaje de contacto - Ashlar House

NUEVO MENSAJE DE CONTACTO

👤 Nombre: {{from_name}}
📧 Email: {{from_email}}
📱 Teléfono: {{phone}}
🏷️ Asunto: {{subject}}

💬 Mensaje:
{{message}}

📩 Newsletter Email: {{newsletter_email}}
📱 Newsletter WhatsApp: {{newsletter_whatsapp}}

---
Enviado desde: ashlarhouse.com
Fecha: {{sent_date}}
IP: {{user_ip}}
```

### 4. Obtener Credenciales

```javascript
// Credenciales actuales configuradas
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'fjE9Qo5zVa2mfHE4m',
  SERVICE_ID: 'service_dk8fe1s',
  TEMPLATE_ID: 'template_8xeecee'
};
```

## 🔧 Implementación Backend

### Migración de Frontend a Backend

Para mayor seguridad, las credenciales de EmailJS se movieron al backend:

```typescript
// BACKEND/.env
EMAILJS_PUBLIC_KEY=fjE9Qo5zVa2mfHE4m
EMAILJS_SERVICE_ID=service_dk8fe1s  
EMAILJS_TEMPLATE_ID=template_8xeecee
```

### API Endpoint Segura

```typescript
// BACKEND/src/api/contact-message/controllers/contact-message.ts
const sendEmailNotification = async (data) => {
  const emailData = {
    to_email: 'admin@ashlarhouse.com',
    from_name: data.name,
    from_email: data.email,
    phone: data.phone || 'No proporcionado',
    subject: data.subject || 'Sin asunto',
    message: data.message,
    newsletter_email: data.newsletter_email ? 'Sí' : 'No',
    newsletter_whatsapp: data.newsletter_whatsapp ? 'Sí' : 'No',
    sent_date: new Date().toLocaleString()
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: emailData
      })
    });

    if (response.ok) {
      console.log('✅ Email notification sent successfully');
    } else {
      console.error('❌ Failed to send email notification');
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
```

## 🔌 Integración Frontend

### JavaScript Implementation

```javascript
// FRONTEND/js/newsletter.js
const sendEmailConfirmation = async (subscriberData) => {
  try {
    // Envío a través del backend (más seguro)
    const response = await fetch(`${STRAPI_URL}/api/send-email-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_name: subscriberData.name,
        to_email: subscriberData.email,
        whatsapp_subscription: subscriberData.subscribe_whatsapp ? 'Activado' : 'No activado',
        subscription_date: new Date().toLocaleString()
      })
    });

    if (response.ok) {
      console.log('✅ Confirmation email sent');
    }
  } catch (error) {
    console.error('❌ Error sending confirmation:', error);
  }
};
```

### Fallback Frontend (Desarrollo)

```javascript
// Para desarrollo local si backend no está disponible
const sendEmailDirect = async (templateParams) => {
  try {
    await emailjs.send(
      'service_dk8fe1s',      // Service ID
      'template_8xeecee',     // Template ID
      templateParams,
      'fjE9Qo5zVa2mfHE4m'     // Public Key
    );
    console.log('✅ Email sent via frontend');
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
};
```

## 🧪 Testing

### Script de Prueba Completo

```javascript
// BACKEND/test-emailjs.js
const testEmailJS = async () => {
  const testData = {
    to_name: 'Test User',
    to_email: 'test@example.com',
    from_name: 'Test Sender',
    from_email: 'sender@example.com',
    phone: '5218119936655',
    subject: 'test',
    message: 'Este es un mensaje de prueba del sistema EmailJS.',
    newsletter_email: 'Sí',
    newsletter_whatsapp: 'No',
    sent_date: new Date().toLocaleString()
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: testData
      })
    });

    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ EmailJS test successful:', result);
    } else {
      console.error('❌ EmailJS test failed:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

testEmailJS();
```

### Verificación de Configuración

```javascript
// BACKEND/scripts/verify-emailjs.js
const verifyEmailJSConfig = () => {
  console.log('🔍 Verificando configuración EmailJS...');
  
  const requiredVars = [
    'EMAILJS_PUBLIC_KEY',
    'EMAILJS_SERVICE_ID', 
    'EMAILJS_TEMPLATE_ID'
  ];

  let allConfigured = true;

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Configurado`);
    } else {
      console.error(`❌ ${varName}: Faltante`);
      allConfigured = false;
    }
  });

  return allConfigured;
};
```

## 📊 Analytics y Monitoring

### EmailJS Dashboard Metrics

EmailJS proporciona métricas básicas:
- **Emails enviados**: Contador mensual
- **Tasa de éxito**: Porcentaje de entregas exitosas
- **Errores**: Log de fallos y causas

### Custom Analytics

```javascript
// BACKEND/src/utils/email-analytics.js
class EmailAnalytics {
  static stats = {
    sent: 0,
    failed: 0,
    byTemplate: {},
    lastSent: null
  };

  static recordSent(templateId) {
    this.stats.sent++;
    this.stats.byTemplate[templateId] = (this.stats.byTemplate[templateId] || 0) + 1;
    this.stats.lastSent = new Date();
    console.log(`📊 Email stats: ${this.stats.sent} sent, ${this.stats.failed} failed`);
  }

  static recordFailed(templateId) {
    this.stats.failed++;
    console.error(`📊 Email failed for template: ${templateId}`);
  }

  static getStats() {
    return {
      ...this.stats,
      successRate: this.stats.sent / (this.stats.sent + this.stats.failed) * 100
    };
  }
}
```

## 🔐 Seguridad

### Mejores Prácticas

1. **Variables de Entorno**
   ```bash
   # ❌ Nunca hardcodear en código
   const publicKey = 'fjE9Qo5zVa2mfHE4m';
   
   # ✅ Usar variables de entorno
   const publicKey = process.env.EMAILJS_PUBLIC_KEY;
   ```

2. **Validación de Datos**
   ```javascript
   const validateEmailData = (data) => {
     const required = ['to_email', 'from_name', 'message'];
     
     for (const field of required) {
       if (!data[field]) {
         throw new Error(`Campo requerido: ${field}`);
       }
     }
     
     // Validar formato email
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(data.to_email)) {
       throw new Error('Formato de email inválido');
     }
     
     return true;
   };
   ```

3. **Rate Limiting**
   ```javascript
   // Evitar spam - máximo 5 emails por minuto
   const emailRateLimiter = new Map();
   
   const canSendEmail = (email) => {
     const now = Date.now();
     const userAttempts = emailRateLimiter.get(email) || [];
     
     // Filtrar intentos de último minuto
     const recentAttempts = userAttempts.filter(
       attempt => now - attempt < 60000
     );
     
     if (recentAttempts.length >= 5) {
       return false;
     }
     
     recentAttempts.push(now);
     emailRateLimiter.set(email, recentAttempts);
     return true;
   };
   ```

## 🚨 Troubleshooting

### Errores Comunes

#### 1. Error 400: Bad Request
```javascript
// Causa: Parámetros faltantes o inválidos
// Solución: Verificar template_params
{
  "error": "Missing required parameter: template_id"
}
```

#### 2. Error 401: Unauthorized
```javascript
// Causa: Public Key incorrecta
// Solución: Verificar EMAILJS_PUBLIC_KEY
{
  "error": "Invalid user_id"
}
```

#### 3. Error 422: Template Error
```javascript
// Causa: Template ID inexistente
// Solución: Verificar template en dashboard EmailJS
{
  "error": "Template not found"
}
```

### Debugging Avanzado

```javascript
// BACKEND/src/utils/emailjs-debug.js
const debugEmailJS = async (templateParams) => {
  console.log('🔍 Debug EmailJS...');
  console.log('📧 Service ID:', process.env.EMAILJS_SERVICE_ID);
  console.log('📋 Template ID:', process.env.EMAILJS_TEMPLATE_ID);
  console.log('🔑 Public Key:', process.env.EMAILJS_PUBLIC_KEY?.substring(0, 8) + '...');
  console.log('📊 Template Params:', JSON.stringify(templateParams, null, 2));
  
  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: templateParams
  };
  
  console.log('📤 Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response:', responseText);
    
    return response.ok;
  } catch (error) {
    console.error('❌ Network Error:', error);
    return false;
  }
};
```

## 🔄 Producción y Scaling

### Limites del Plan Gratuito
- **200 emails/mes** incluidos
- **Sin soporte técnico**
- **Branding EmailJS** en emails

### Upgrade Recomendaciones
```
Plan Personal ($15/mes):
- 1,000 emails/mes
- Sin branding
- Soporte por email

Plan Team ($45/mes):
- 5,000 emails/mes
- Múltiples usuarios
- Analytics avanzados
```

### Alternativas para Alto Volumen
```
SendGrid: Hasta 100 emails/día gratis
Mailgun: 1,000 emails/mes gratis
Amazon SES: $0.10 por 1,000 emails
```
