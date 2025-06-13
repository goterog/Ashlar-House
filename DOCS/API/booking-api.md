# 🏠 Bookings API

*API completa de gestión de reservas - Ashlar House*

## 🎯 Endpoint Base
```
POST /api/bookings
GET  /api/bookings
GET  /api/bookings/:id
PUT  /api/bookings/:id
DELETE /api/bookings/:id
```

## 📊 Schema del Content Type

```typescript
interface Booking {
  id: number;                    // Auto-generado
  guest_name: string;            // Nombre del huésped (requerido)
  email: string;                 // Email del huésped (requerido)
  phone: string;                 // Teléfono del huésped (requerido)
  check_in: Date;               // Fecha de check-in (requerida)
  check_out: Date;              // Fecha de check-out (requerida)
  guests: number;               // Número de huéspedes (requerido)
  status: string;               // Estado de la reserva
  message?: string;             // Mensaje del huésped (opcional)
  airbnb_calendar_id?: string;  // ID del evento de Airbnb (opcional)
  createdAt: Date;              // Timestamp automático
  updatedAt: Date;              // Timestamp automático
}
```

## 🏷️ Status Enum Values
```typescript
type BookingStatus = 
  | 'Reservado'      // Reserva confirmada
  | 'Bloqueado'      // Fecha bloqueada
  | 'Disponible'     // Fecha disponible
  | 'Pendiente'      // Reserva pendiente de confirmación
  | 'Cancelado';     // Reserva cancelada
```

## 🔌 Ejemplos de Uso

### Crear Reserva (POST)
```javascript
// Request
POST /api/bookings
Content-Type: application/json

{
  "data": {
    "guest_name": "María González",
    "email": "maria@example.com",
    "phone": "5218119936655",
    "check_in": "2025-06-20",
    "check_out": "2025-06-22",
    "guests": 4,
    "status": "Reservado",
    "message": "Celebramos nuestro aniversario, ¿podrían preparar algo especial?"
  }
}

// Response
{
  "data": {
    "id": 15,
    "guest_name": "María González",
    "email": "maria@example.com",
    "phone": "5218119936655",
    "check_in": "2025-06-20",
    "check_out": "2025-06-22",
    "guests": 4,
    "status": "Reservado",
    "message": "Celebramos nuestro aniversario, ¿podrían preparar algo especial?",
    "airbnb_calendar_id": null,
    "createdAt": "2025-06-13T10:30:00.000Z",
    "updatedAt": "2025-06-13T10:30:00.000Z"
  },
  "meta": {}
}
```

### Listar Reservas (GET)
```javascript
// Request
GET /api/bookings?sort=check_in:asc

// Response
{
  "data": [
    {
      "id": 15,
      "guest_name": "María González",
      "email": "maria@example.com",
      "check_in": "2025-06-20",
      "check_out": "2025-06-22",
      "guests": 4,
      "status": "Reservado",
      "createdAt": "2025-06-13T10:30:00.000Z"
    },
    {
      "id": 16,
      "guest_name": "Carlos López",
      "email": "carlos@example.com",
      "check_in": "2025-06-25",
      "check_out": "2025-06-27",
      "guests": 2,
      "status": "Bloqueado",
      "airbnb_calendar_id": "airbnb_event_123",
      "createdAt": "2025-06-13T12:10:00.000Z"
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

### Obtener Reserva Específica (GET)
```javascript
// Request
GET /api/bookings/15

// Response
{
  "data": {
    "id": 15,
    "guest_name": "María González",
    "email": "maria@example.com",
    "phone": "5218119936655",
    "check_in": "2025-06-20",
    "check_out": "2025-06-22",
    "guests": 4,
    "status": "Reservado",
    "message": "Celebramos nuestro aniversario, ¿podrían preparar algo especial?",
    "airbnb_calendar_id": null,
    "createdAt": "2025-06-13T10:30:00.000Z",
    "updatedAt": "2025-06-13T10:30:00.000Z"
  },
  "meta": {}
}
```

## 🛡️ Validaciones

### Reglas de Validación
- **guest_name**: Requerido, mínimo 2 caracteres, máximo 100
- **email**: Requerido, formato email válido
- **phone**: Requerido, formato numérico
- **check_in**: Requerido, fecha futura
- **check_out**: Requerido, posterior a check_in
- **guests**: Requerido, número entre 1 y 10
- **status**: Enum values only
- **message**: Opcional, máximo 500 caracteres

### Validaciones de Negocio
```javascript
// Validación de fechas
const validateDates = (checkIn, checkOut) => {
  const today = new Date();
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  if (start < today) {
    throw new Error('Check-in debe ser fecha futura');
  }
  
  if (end <= start) {
    throw new Error('Check-out debe ser posterior a check-in');
  }
  
  // Máximo 30 días de estadía
  const maxStay = 30 * 24 * 60 * 60 * 1000;
  if (end - start > maxStay) {
    throw new Error('Estadía máxima: 30 días');
  }
};

// Validación de disponibilidad
const validateAvailability = async (checkIn, checkOut, excludeId = null) => {
  const overlapping = await strapi.entityService.findMany('api::booking.booking', {
    filters: {
      $and: [
        { id: { $ne: excludeId } },
        { status: { $ne: 'Cancelado' } },
        {
          $or: [
            {
              $and: [
                { check_in: { $lte: checkIn } },
                { check_out: { $gt: checkIn } }
              ]
            },
            {
              $and: [
                { check_in: { $lt: checkOut } },
                { check_out: { $gte: checkOut } }
              ]
            },
            {
              $and: [
                { check_in: { $gte: checkIn } },
                { check_out: { $lte: checkOut } }
              ]
            }
          ]
        }
      ]
    }
  });
  
  if (overlapping.length > 0) {
    throw new Error('Fechas no disponibles - conflicto con reserva existente');
  }
};
```

### Errores Comunes
```javascript
// Fechas inválidas
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Check-out debe ser posterior a check-in",
    "details": {
      "errors": [
        {
          "path": ["check_out"],
          "message": "Invalid date range",
          "name": "ValidationError"
        }
      ]
    }
  }
}

// Conflicto de disponibilidad
{
  "error": {
    "status": 409,
    "name": "ConflictError",
    "message": "Fechas no disponibles - conflicto con reserva existente",
    "details": {
      "conflictingBooking": {
        "id": 12,
        "check_in": "2025-06-19",
        "check_out": "2025-06-21"
      }
    }
  }
}
```

## 🔍 Filtros y Búsqueda

### Filtrar por Estado
```javascript
GET /api/bookings?filters[status][$eq]=Reservado
```

### Filtrar por Rango de Fechas
```javascript
GET /api/bookings?filters[check_in][$gte]=2025-06-01&filters[check_out][$lte]=2025-06-30
```

### Filtrar por Fuente (Airbnb vs Manual)
```javascript
// Solo reservas de Airbnb
GET /api/bookings?filters[airbnb_calendar_id][$notNull]=true

// Solo reservas manuales
GET /api/bookings?filters[airbnb_calendar_id][$null]=true
```

### Búsqueda por Huésped
```javascript
GET /api/bookings?filters[guest_name][$contains]=María
GET /api/bookings?filters[email][$contains]=@example.com
```

### Ordenamiento
```javascript
GET /api/bookings?sort=check_in:asc
GET /api/bookings?sort=createdAt:desc
GET /api/bookings?sort=status:asc,check_in:asc
```

## 🤖 Lifecycle Hooks (Automático)

### Notificaciones WhatsApp Automáticas
```javascript
// BACKEND/src/index.ts
strapi.db.lifecycles.subscribe({
  models: ['api::booking.booking'],
  
  async afterCreate(event) {
    const { result } = event;
    
    // Solo enviar para estados que requieren notificación
    if (result.status === 'Reservado' || result.status === 'Bloqueado') {
      await sendWhatsAppNotification(result);
    }
  },
  
  async afterUpdate(event) {
    const { result, params } = event;
    
    // Enviar notificación si el estado cambió
    if (params.data.status && params.data.status !== result.status) {
      await sendWhatsAppNotification(result);
    }
  }
});
```

### Validaciones Pre-Creación
```javascript
strapi.db.lifecycles.subscribe({
  models: ['api::booking.booking'],
  
  async beforeCreate(event) {
    const { params } = event;
    
    // Validar disponibilidad
    await validateAvailability(
      params.data.check_in, 
      params.data.check_out
    );
    
    // Validar fechas
    await validateDates(
      params.data.check_in,
      params.data.check_out
    );
  }
});
```

## 🧪 Testing

### Test de Creación de Reserva
```javascript
// BACKEND/test-booking-api.js
const testCreateBooking = async () => {
  const testData = {
    data: {
      guest_name: 'Test Guest',
      email: 'test@example.com',
      phone: '5218119936655',
      check_in: '2025-07-01',
      check_out: '2025-07-03',
      guests: 2,
      status: 'Reservado',
      message: 'Test booking for API verification'
    }
  };

  try {
    const response = await fetch('http://localhost:1337/api/bookings', {
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
    console.log('✅ Booking created successfully:', result);

    // Verificar que se envió WhatsApp
    console.log('📱 WhatsApp notification should be sent automatically');

    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testCreateBooking();
```

### Test de Validación de Disponibilidad
```javascript
const testAvailabilityConflict = async () => {
  // Crear primera reserva
  const booking1 = await createTestBooking({
    check_in: '2025-07-01',
    check_out: '2025-07-03'
  });

  // Intentar crear reserva conflictiva
  try {
    const booking2 = await createTestBooking({
      check_in: '2025-07-02',
      check_out: '2025-07-04'
    });
    
    console.error('❌ Should have failed due to conflict');
  } catch (error) {
    console.log('✅ Conflict correctly detected:', error.message);
  }
};
```

## 📅 Integración con Calendario Frontend

### FullCalendar Events Format
```javascript
// Convertir bookings a eventos de calendario
const formatBookingsForCalendar = (bookings) => {
  return bookings.map(booking => ({
    id: booking.id,
    title: `${booking.guest_name} (${booking.guests} huéspedes)`,
    start: booking.check_in,
    end: booking.check_out,
    color: getStatusColor(booking.status),
    extendedProps: {
      guest_name: booking.guest_name,
      email: booking.email,
      phone: booking.phone,
      guests: booking.guests,
      status: booking.status,
      message: booking.message,
      source: booking.airbnb_calendar_id ? 'Airbnb' : 'Manual'
    }
  }));
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Reservado': return '#22c55e';   // Verde
    case 'Bloqueado': return '#ef4444';   // Rojo
    case 'Pendiente': return '#f59e0b';   // Amarillo
    case 'Cancelado': return '#6b7280';   // Gris
    default: return '#3b82f6';            // Azul
  }
};
```

### Endpoint para Calendario
```javascript
// GET /api/bookings/calendar
const getCalendarEvents = async (ctx) => {
  const { start, end } = ctx.query;
  
  const bookings = await strapi.entityService.findMany('api::booking.booking', {
    filters: {
      $and: [
        { check_in: { $lte: end } },
        { check_out: { $gte: start } },
        { status: { $ne: 'Cancelado' } }
      ]
    },
    sort: 'check_in:asc'
  });
  
  const events = formatBookingsForCalendar(bookings);
  ctx.body = { data: events };
};
```

## 📊 Analytics y Reportes

### Ocupación por Mes
```javascript
const getOccupancyByMonth = async (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const bookings = await strapi.entityService.findMany('api::booking.booking', {
    filters: {
      $and: [
        { check_in: { $lte: endDate } },
        { check_out: { $gte: startDate } },
        { status: { $in: ['Reservado', 'Bloqueado'] } }
      ]
    }
  });
  
  const totalDays = endDate.getDate();
  const occupiedDays = calculateOccupiedDays(bookings, startDate, endDate);
  const occupancyRate = (occupiedDays / totalDays * 100).toFixed(2);
  
  return {
    month: `${year}-${month.toString().padStart(2, '0')}`,
    totalDays,
    occupiedDays,
    occupancyRate: occupancyRate + '%',
    bookings: bookings.length
  };
};
```

### Revenue por Período
```javascript
const getRevenueReport = async (startDate, endDate) => {
  const bookings = await strapi.entityService.findMany('api::booking.booking', {
    filters: {
      $and: [
        { check_in: { $gte: startDate } },
        { check_out: { $lte: endDate } },
        { status: 'Reservado' }
      ]
    },
    populate: ['rate'] // Si tienes pricing
  });
  
  const stats = {
    totalBookings: bookings.length,
    totalNights: 0,
    totalGuests: 0,
    averageStay: 0,
    sourceBreakdown: {
      manual: 0,
      airbnb: 0
    }
  };
  
  bookings.forEach(booking => {
    const nights = Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24));
    stats.totalNights += nights;
    stats.totalGuests += booking.guests;
    
    if (booking.airbnb_calendar_id) {
      stats.sourceBreakdown.airbnb++;
    } else {
      stats.sourceBreakdown.manual++;
    }
  });
  
  stats.averageStay = (stats.totalNights / stats.totalBookings).toFixed(1);
  
  return stats;
};
```

## 🔐 Permisos y Roles

### Configuración en Strapi Admin
```javascript
// Permisos recomendados para rol Public:
{
  "booking": {
    "create": true,      // Permitir crear reservas desde frontend
    "find": true,        // Permitir ver disponibilidad
    "findOne": false,    // No permitir ver detalles específicos
    "update": false,     // No permitir modificar
    "delete": false      // No permitir eliminar
  }
}

// Para usuarios autenticados (si se implementa):
{
  "booking": {
    "create": true,
    "find": true,
    "findOne": true,     // Pueden ver sus propias reservas
    "update": false,     // Solo admin puede modificar
    "delete": false      // Solo admin puede cancelar
  }
}
```

### Middleware de Autorización
```javascript
// BACKEND/src/api/booking/middlewares/auth.js
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.method === 'POST') {
      // Validar que solo se pueden crear reservas futuras
      const { check_in } = ctx.request.body.data;
      if (new Date(check_in) < new Date()) {
        return ctx.badRequest('No se pueden crear reservas en fechas pasadas');
      }
    }
    
    if (ctx.request.method === 'PUT' || ctx.request.method === 'DELETE') {
      // Solo admin puede modificar/eliminar
      if (!ctx.state.user || ctx.state.user.role.type !== 'admin') {
        return ctx.forbidden('Solo administradores pueden modificar reservas');
      }
    }
    
    await next();
  };
};
```
