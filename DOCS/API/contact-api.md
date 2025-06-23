# 💬 Contact Messages API

*Documentación completa de la API de mensajes de contacto - Ashlar House*

## 🎯 Endpoint Base
```
POST /api/contact-messages
GET  /api/contact-messages
GET  /api/contact-messages/:id
PUT  /api/contact-messages/:id
DELETE /api/contact-messages/:id
```

## 📊 Schema del Content Type

```typescript
interface ContactMessage {
  id: number;                    // Auto-generado
  name: string;                  // Nombre del contacto (requerido)
  email: string;                 // Email del contacto (requerido)
  phone?: string;                // Teléfono del contacto (opcional)
  subject?: string;              // Asunto del mensaje (opcional)
  message: string;               // Mensaje completo (requerido)
  newsletter_email: boolean;     // Auto-suscripción newsletter email
  newsletter_whatsapp: boolean;  // Auto-suscripción newsletter WhatsApp
  createdAt: Date;              // Timestamp automático
  updatedAt: Date;              // Timestamp automático
}
```

## 🏷️ Subject Enum Values
```typescript
type SubjectType = 
  | 'informacion_general'    // Información General
  | 'reserva'               // Consulta de Reserva
  | 'cancelacion'           // Cancelación
  | 'otro';                 // Otro
```

## 🔌 Ejemplos de Uso

### Crear Mensaje de Contacto (POST)
```javascript
// Request
POST /api/contact-messages
Content-Type: application/json

{
  "data": {
    "name": "Ana García",
    "email": "ana@example.com",
    "phone": "5218119936655",
    "subject": "reserva",
    "message": "Hola, me gustaría reservar para el fin de semana del 20-22 de junio. ¿Tienen disponibilidad?",
    "newsletter_email": true,
    "newsletter_whatsapp": false
  }
}

// Response
{
  "data": {
    "id": 8,
    "name": "Ana García",
    "email": "ana@example.com",
    "phone": "5218119936655",
    "subject": "reserva",
    "message": "Hola, me gustaría reservar para el fin de semana del 20-22 de junio. ¿Tienen disponibilidad?",
    "newsletter_email": true,
    "newsletter_whatsapp": false,
    "createdAt": "2025-06-13T08:15:00.000Z",
    "updatedAt": "2025-06-13T08:15:00.000Z"
  },
  "meta": {}
}
```

### Listar Mensajes de Contacto (GET)
```javascript
// Request
GET /api/contact-messages?sort=createdAt:desc

// Response
{
  "data": [
    {
      "id": 8,
      "name": "Ana García",
      "email": "ana@example.com",
      "subject": "reserva",
      "message": "Consulta sobre disponibilidad...",
      "newsletter_email": true,
      "newsletter_whatsapp": false,
      "createdAt": "2025-06-13T08:15:00.000Z"
    },
    {
      "id": 7,
      "name": "Pedro Martínez",
      "email": "pedro@example.com",
      "subject": "informacion_general",
      "message": "¿Qué servicios incluye la cabaña?",
      "newsletter_email": false,
      "newsletter_whatsapp": true,
      "createdAt": "2025-06-12T14:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
```

## 🛡️ Validaciones

### Reglas de Validación
- **name**: Requerido, mínimo 2 caracteres, máximo 100
- **email**: Requerido, formato email válido
- **phone**: Opcional, solo números y espacios
- **subject**: Opcional, enum values only
- **message**: Requerido, mínimo 10 caracteres, máximo 1000
- **newsletter_email**: Boolean, default false
- **newsletter_whatsapp**: Boolean, default false

### Errores Comunes
```javascript
// Mensaje muy corto
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Message must be at least 10 characters long",
    "details": {
      "errors": [
        {
          "path": ["message"],
          "message": "Message must be at least 10 characters long",
          "name": "ValidationError"
        }
      ]
    }
  }
}

// Email inválido
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid email format",
    "details": {
      "errors": [
        {
          "path": ["email"],
          "message": "Invalid email format",
          "name": "ValidationError"
        }
      ]
    }
  }
}

// Subject inválido
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Subject must be one of: informacion_general, reserva, cancelacion, otro",
    "details": {
      "errors": [
        {
          "path": ["subject"],
          "message": "Invalid enumeration value",
          "name": "ValidationError"
        }
      ]
    }
  }
}
```

## 🔍 Filtros y Búsqueda

### Filtrar por Asunto
```javascript
GET /api/contact-messages?filters[subject][$eq]=reserva
```

### Filtrar por Suscripción Newsletter
```javascript
GET /api/contact-messages?filters[newsletter_email][$eq]=true
```

### Búsqueda por Email
```javascript
GET /api/contact-messages?filters[email][$contains]=example.com
```

### Búsqueda en Mensaje
```javascript
GET /api/contact-messages?filters[message][$contains]=reserva
```

### Rango de Fechas
```javascript
GET /api/contact-messages?filters[createdAt][$gte]=2025-06-01&filters[createdAt][$lte]=2025-06-30
```

## 🤖 Lifecycle Hooks (Automático)

Cuando se crea un `contact-message`, automáticamente:

### 1. Auto-Suscripción Newsletter
```javascript
// Si newsletter_email = true, crea newsletter-subscriber
if (data.newsletter_email || data.newsletter_whatsapp) {
  await strapi.entityService.create('api::newsletter-subscriber.newsletter-subscriber', {
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subscribe_email: data.newsletter_email,
      subscribe_whatsapp: data.newsletter_whatsapp,
      source: 'contact-form'
    }
  });
}
```

### 2. EmailJS Notification
```javascript
// Envío automático de email con detalles del mensaje
const emailData = {
  to_email: process.env.ADMIN_EMAIL,
  from_name: data.name,
  from_email: data.email,
  subject: data.subject,
  message: data.message,
  phone: data.phone
};
```

## 🧪 Testing

### Script de Prueba Completo
```javascript
// BACKEND/test-contact-api.js
const testContactAPI = async () => {
  const testData = {
    data: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '5218119936655',
      subject: 'informacion_general',
      message: 'Este es un mensaje de prueba para verificar que el sistema funciona correctamente.',
      newsletter_email: true,
      newsletter_whatsapp: false
    }
  };

  try {
    const response = await fetch('http://localhost:1337/api/contact-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Contact message created:', result);

    // Verificar si se creó el newsletter subscriber
    const subscriberResponse = await fetch(
      `http://localhost:1337/api/newsletter-subscribers?filters[email][$eq]=${testData.data.email}`
    );
    const subscribers = await subscriberResponse.json();
    
    if (subscribers.data.length > 0) {
      console.log('✅ Newsletter subscriber auto-created:', subscribers.data[0]);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testContactAPI();
```

## 🔗 Integración Frontend

### HTML Form Example
```html
<form id="contactForm" class="space-y-4">
  <div>
    <label for="name">Nombre *</label>
    <input type="text" id="name" name="name" required>
  </div>
  
  <div>
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div>
    <label for="phone">Teléfono</label>
    <input type="tel" id="phone" name="phone">
  </div>
  
  <div>
    <label for="subject">Asunto</label>
    <select id="subject" name="subject">
      <option value="">Seleccionar...</option>
      <option value="informacion_general">Información General</option>
      <option value="reserva">Consulta de Reserva</option>
      <option value="cancelacion">Cancelación</option>
      <option value="otro">Otro</option>
    </select>
  </div>
  
  <div>
    <label for="message">Mensaje *</label>
    <textarea id="message" name="message" required rows="4"></textarea>
  </div>
  
  <div class="flex items-center space-x-4">
    <label class="flex items-center">
      <input type="checkbox" name="newsletter_email" value="true">
      <span class="ml-2">Suscribirme al newsletter por email</span>
    </label>
    
    <label class="flex items-center">
      <input type="checkbox" name="newsletter_whatsapp" value="true">
      <span class="ml-2">Suscribirme al newsletter por WhatsApp</span>
    </label>
  </div>
  
  <button type="submit">Enviar Mensaje</button>
</form>
```

### JavaScript Handler
```javascript
// FRONTEND/js/newsletter.js
const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`${STRAPI_URL}/api/contact-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message,
          newsletter_email: formData.newsletter_email === 'true',
          newsletter_whatsapp: formData.newsletter_whatsapp === 'true'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Message sent successfully:', result);
    
    // Mostrar mensaje de éxito al usuario
    showSuccessMessage('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
    
    return result;
  } catch (error) {
    console.error('❌ Error sending message:', error);
    showErrorMessage('Error al enviar el mensaje. Inténtalo nuevamente.');
    throw error;
  }
};
```

## 📊 Analytics y Reportes

### Mensajes por Asunto
```javascript
const getMessagesBySubject = async () => {
  const subjects = ['informacion_general', 'reserva', 'cancelacion', 'otro'];
  const results = {};
  
  for (const subject of subjects) {
    const response = await fetch(
      `/api/contact-messages?filters[subject][$eq]=${subject}&pagination[pageSize]=0`
    );
    const data = await response.json();
    results[subject] = data.meta.pagination.total;
  }
  
  return results;
};
```

### Tasa de Conversión Newsletter
```javascript
const getNewsletterConversionRate = async () => {
  const totalMessages = await fetch('/api/contact-messages?pagination[pageSize]=0');
  const emailSubscriptions = await fetch('/api/contact-messages?filters[newsletter_email][$eq]=true&pagination[pageSize]=0');
  const whatsappSubscriptions = await fetch('/api/contact-messages?filters[newsletter_whatsapp][$eq]=true&pagination[pageSize]=0');
  
  const total = (await totalMessages.json()).meta.pagination.total;
  const emailSubs = (await emailSubscriptions.json()).meta.pagination.total;
  const whatsappSubs = (await whatsappSubscriptions.json()).meta.pagination.total;
  
  return {
    total_messages: total,
    email_conversion_rate: (emailSubs / total * 100).toFixed(2) + '%',
    whatsapp_conversion_rate: (whatsappSubs / total * 100).toFixed(2) + '%'
  };
};
```
