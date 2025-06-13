# 📧 Newsletter Subscribers API

*Documentación completa de la API - Ashlar House*

## 🎯 Endpoint Base
```
POST /api/newsletter-subscribers
GET  /api/newsletter-subscribers
GET  /api/newsletter-subscribers/:id
PUT  /api/newsletter-subscribers/:id
DELETE /api/newsletter-subscribers/:id
```

## 📊 Schema del Content Type

```typescript
interface NewsletterSubscriber {
  id: number;                    // Auto-generado
  name: string;                  // Nombre del suscriptor
  email: string;                 // Email único y requerido
  phone?: string;                // Número WhatsApp (opcional)
  subscribe_email: boolean;      // Suscripción email
  subscribe_whatsapp: boolean;   // Suscripción WhatsApp
  source: string;                // Origen: 'footer', 'contact-form', 'campaign'
  createdAt: Date;              // Timestamp automático
  updatedAt: Date;              // Timestamp automático
}
```

## 🔌 Ejemplos de Uso

### Crear Suscriptor (POST)
```javascript
// Request
POST /api/newsletter-subscribers
Content-Type: application/json

{
  "data": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "5218119936655",
    "subscribe_email": true,
    "subscribe_whatsapp": true,
    "source": "footer_form"
  }
}

// Response
{
  "data": {
    "id": 5,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "5218119936655",
    "subscribe_email": true,
    "subscribe_whatsapp": true,
    "source": "footer_form",
    "createdAt": "2025-06-13T07:30:00.000Z",
    "updatedAt": "2025-06-13T07:30:00.000Z"
  },
  "meta": {}
}
```

### Listar Suscriptores (GET)
```javascript
// Request
GET /api/newsletter-subscribers

// Response
{
  "data": [
    {
      "id": 1,
      "name": "María González",
      "email": "maria@example.com",
      "subscribe_email": true,
      "subscribe_whatsapp": false,
      "source": "contact-form",
      "createdAt": "2025-06-10T12:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Carlos López",
      "email": "carlos@example.com",
      "subscribe_email": true,
      "subscribe_whatsapp": true,
      "source": "footer_form",
      "createdAt": "2025-06-11T09:15:00.000Z"
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

### Obtener Suscriptor Específico (GET)
```javascript
// Request
GET /api/newsletter-subscribers/5

// Response
{
  "data": {
    "id": 5,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "5218119936655",
    "subscribe_email": true,
    "subscribe_whatsapp": true,
    "source": "footer_form",
    "createdAt": "2025-06-13T07:30:00.000Z",
    "updatedAt": "2025-06-13T07:30:00.000Z"
  },
  "meta": {}
}
```

## 🛡️ Validaciones

### Reglas de Validación
- **email**: Requerido, único, formato válido
- **name**: Requerido, mínimo 2 caracteres
- **phone**: Opcional, formato numérico
- **subscribe_email**: Boolean, default false
- **subscribe_whatsapp**: Boolean, default false
- **source**: String, valores permitidos

### Errores Comunes
```javascript
// Email duplicado
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "This attribute must be unique",
    "details": {
      "errors": [
        {
          "path": ["email"],
          "message": "This attribute must be unique",
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
```

## 🔍 Filtros y Búsqueda

### Filtrar por Suscripción Email
```javascript
GET /api/newsletter-subscribers?filters[subscribe_email][$eq]=true
```

### Filtrar por Suscripción WhatsApp
```javascript
GET /api/newsletter-subscribers?filters[subscribe_whatsapp][$eq]=true
```

### Filtrar por Fuente
```javascript
GET /api/newsletter-subscribers?filters[source][$eq]=footer_form
```

### Búsqueda por Email
```javascript
GET /api/newsletter-subscribers?filters[email][$contains]=example.com
```

### Paginación
```javascript
GET /api/newsletter-subscribers?pagination[page]=1&pagination[pageSize]=10
```

### Ordenamiento
```javascript
GET /api/newsletter-subscribers?sort=createdAt:desc
```

## 🧪 Testing

### Script de Prueba
```javascript
// BACKEND/test-newsletter-api.js
const testNewsletterAPI = async () => {
  const response = await fetch('http://localhost:1337/api/newsletter-subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        subscribe_email: true,
        subscribe_whatsapp: false,
        source: 'test_script'
      }
    })
  });
  
  const result = await response.json();
  console.log('Newsletter API Result:', result);
};

testNewsletterAPI();
```

## 🔗 Integración Frontend

### JavaScript Example
```javascript
// FRONTEND/js/newsletter.js
const subscribeToNewsletter = async (formData) => {
  try {
    const response = await fetch(`${STRAPI_URL}/api/newsletter-subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subscribe_email: formData.subscribe_email,
          subscribe_whatsapp: formData.subscribe_whatsapp,
          source: 'footer_form'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Subscription successful:', result);
    return result;
  } catch (error) {
    console.error('Subscription failed:', error);
    throw error;
  }
};
```

## 📊 Campaign Management

### Exportar Suscriptores Email
```javascript
const exportEmailSubscribers = async () => {
  const response = await fetch(
    '/api/newsletter-subscribers?filters[subscribe_email][$eq]=true&fields[0]=name&fields[1]=email&fields[2]=createdAt'
  );
  return await response.json();
};
```

### Exportar Suscriptores WhatsApp
```javascript
const exportWhatsAppSubscribers = async () => {
  const response = await fetch(
    '/api/newsletter-subscribers?filters[subscribe_whatsapp][$eq]=true&fields[0]=name&fields[1]=phone&fields[2]=createdAt'
  );
  return await response.json();
};
```
