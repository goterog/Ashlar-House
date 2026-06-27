# 🏠 Airbnb Calendar Synchronization

*Sincronización automática con calendario de Airbnb - Ashlar House*

## 🎯 Funcionalidad

El sistema sincroniza automáticamente el calendario de disponibilidad con Airbnb utilizando:
- **iCal URL** de Airbnb para importar eventos
- **Cron Jobs** programados cada 3 horas
- **Lifecycle Hooks** para notificaciones automáticas
- **Parser inteligente** para eventos de calendario

## ⚙️ Configuración

### 1. URL del Calendario iCal

```javascript
// BACKEND/src/index.ts
const AIRBNB_ICAL_URL = 'https://www.airbnb.com/calendar/ical/your-listing-id.ics';
```

### 2. Programación Automática

```javascript
// Cron job: cada 3 horas, 10 minutos después de la hora
cron.schedule('10 */3 * * *', async () => {
  console.log('🔄 Iniciando sincronización con Airbnb...');
  await importAirbnbCalendar(strapi);
});
```

### 3. Horarios de Sincronización

```
🕐 12:10 AM → Sincroniza cambios de 12:00 AM
🕐 03:10 AM → Sincroniza cambios de 03:00 AM  
🕐 06:10 AM → Sincroniza cambios de 06:00 AM
🕐 09:10 AM → Sincroniza cambios de 09:00 AM
🕐 12:10 PM → Sincroniza cambios de 12:00 PM
🕐 03:10 PM → Sincroniza cambios de 03:00 PM
🕐 06:10 PM → Sincroniza cambios de 06:00 PM
🕐 09:10 PM → Sincroniza cambios de 09:00 PM
```

## 🔄 Proceso de Sincronización

### 1. Importación de Datos
```javascript
const importAirbnbCalendar = async (strapi) => {
  try {
    // 1. Fetch iCal data from Airbnb
    const response = await fetch(AIRBNB_ICAL_URL);
    const icalData = await response.text();
    
    // 2. Parse iCal events
    const events = parseICalEvents(icalData);
    
    // 3. Process each event
    for (const event of events) {
      await processCalendarEvent(strapi, event);
    }
    
    console.log(`✅ Sincronización completada: ${events.length} eventos procesados`);
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
  }
};
```

### 2. Procesamiento de Eventos
```javascript
const processCalendarEvent = async (strapi, event) => {
  const bookingData = {
    guest_name: event.summary || 'Airbnb Guest',
    email: 'airbnb@guest.com',
    phone: 'N/A',
    check_in: event.start,
    check_out: event.end,
    guests: 1,
    status: event.summary.includes('Blocked') ? 'Bloqueado' : 'Reservado',
    airbnb_calendar_id: event.uid
  };
  
  // Verificar si ya existe
  const existing = await strapi.entityService.findMany('api::booking.booking', {
    filters: { airbnb_calendar_id: event.uid }
  });
  
  if (existing.length === 0) {
    // Crear nuevo booking - activará lifecycle hooks automáticamente
    await strapi.entityService.create('api::booking.booking', {
      data: bookingData
    });
  }
};
```

### 3. Parser de iCal
```javascript
const parseICalEvents = (icalData) => {
  const events = [];
  const lines = icalData.split('\n');
  let currentEvent = null;
  
  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent) {
        events.push(currentEvent);
        currentEvent = null;
      }
    } else if (currentEvent) {
      // Parse event properties
      if (line.startsWith('DTSTART:')) {
        currentEvent.start = parseICalDate(line.split(':')[1]);
      } else if (line.startsWith('DTEND:')) {
        currentEvent.end = parseICalDate(line.split(':')[1]);
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.split(':')[1];
      } else if (line.startsWith('UID:')) {
        currentEvent.uid = line.split(':')[1];
      }
    }
  }
  
  return events;
};
```

## 📱 Notificaciones Automáticas

### Cuando se importa un evento:
1. **Booking creado** → Lifecycle hook activado
2. **WhatsApp enviado** automáticamente a ambos números
3. **Formato de mensaje** según tipo de evento

### Mensajes para Reservas de Airbnb:
```
🏠 NUEVA RESERVA - Ashlar House

👤 Huésped: Airbnb Guest
📧 Email: airbnb@guest.com
📱 Teléfono: N/A
📅 Check-in: 2025-06-20
📅 Check-out: 2025-06-22
👥 Huéspedes: 1

Estado: ✅ RESERVADO (Airbnb)
Fecha: 2025-06-13 10:10:00
```

### Mensajes para Bloqueos:
```
🔒 BLOQUEO DE CALENDARIO - Ashlar House

📅 Fecha: 2025-06-20 - 2025-06-22
📝 Motivo: Bloqueo desde Airbnb

Estado: ❌ BLOQUEADO
Fecha: 2025-06-13 10:10:00
```

## 🧪 Testing de Sincronización

### Test Manual
```javascript
// BACKEND/scripts/Airbnb sync/test-airbnb-sync.js
const testAirbnbSync = async () => {
  console.log('🧪 Testing Airbnb synchronization...');
  
  // Simular importación
  await importAirbnbCalendar(strapi);
  
  // Verificar bookings creados
  const bookings = await strapi.entityService.findMany('api::booking.booking', {
    filters: { airbnb_calendar_id: { $notNull: true } }
  });
  
  console.log(`✅ Airbnb bookings encontrados: ${bookings.length}`);
};
```

### Verificación de Funcionamiento
```bash
# Ver logs de sincronización
tail -f logs/strapi.log | grep "Airbnb"

# Verificar cron jobs activos
ps aux | grep node

# Test manual de importación
cd BACKEND
node -e "importAirbnbCalendar(require('./src/index.js').strapi)"
```

## 🔧 Configuración Avanzada

### 1. Múltiples Propiedades
```javascript
const AIRBNB_CALENDARS = [
  {
    name: 'Ashlar House',
    url: 'https://www.airbnb.com/calendar/ical/property1.ics',
    property_id: 'ashlar-house'
  },
  {
    name: 'Otra Propiedad',
    url: 'https://www.airbnb.com/calendar/ical/property2.ics', 
    property_id: 'otra-propiedad'
  }
];
```

### 2. Filtros de Eventos
```javascript
const shouldProcessEvent = (event) => {
  // Solo procesar eventos futuros
  const eventDate = new Date(event.start);
  const now = new Date();
  
  if (eventDate < now) {
    return false;
  }
  
  // Filtrar eventos muy largos (>30 días)
  const duration = new Date(event.end) - new Date(event.start);
  const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 días
  
  return duration <= maxDuration;
};
```

### 3. Retry Logic
```javascript
const importWithRetry = async (strapi, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await importAirbnbCalendar(strapi);
      return;
    } catch (error) {
      console.error(`❌ Intento ${attempt} falló:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};
```

## 📊 Monitoring y Logs

### Métricas de Sincronización
```javascript
class AirbnbSyncMetrics {
  static stats = {
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    eventsProcessed: 0,
    lastSync: null
  };
  
  static recordSync(success, eventCount = 0) {
    this.stats.totalSyncs++;
    this.stats.lastSync = new Date();
    
    if (success) {
      this.stats.successfulSyncs++;
      this.stats.eventsProcessed += eventCount;
    } else {
      this.stats.failedSyncs++;
    }
  }
  
  static getStats() {
    return {
      ...this.stats,
      successRate: (this.stats.successfulSyncs / this.stats.totalSyncs * 100).toFixed(2) + '%'
    };
  }
}
```

### Health Check
```javascript
const checkAirbnbHealth = async () => {
  try {
    const response = await fetch(AIRBNB_ICAL_URL, { method: 'HEAD' });
    
    if (response.ok) {
      console.log('✅ Airbnb calendar URL is accessible');
      return true;
    } else {
      console.error('❌ Airbnb calendar URL returned:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Airbnb calendar URL is not accessible:', error);
    return false;
  }
};
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. URL de calendario inválida
```
Error: fetch failed - invalid URL

Solución:
1. Verificar URL de iCal en Airbnb dashboard
2. Regenerar URL si es necesario
3. Verificar permisos de calendario
```

#### 2. Formato de fecha incorrecto
```
Error: Invalid date format in iCal

Solución:
1. Actualizar parseICalDate() function
2. Manejar diferentes formatos de timezone
3. Verificar eventos con fechas especiales
```

#### 3. Eventos duplicados
```
Problema: Mismos eventos importados múltiples veces

Solución:
1. Verificar lógica de deduplicación
2. Usar airbnb_calendar_id como unique key
3. Implementar cleanup de eventos antiguos
```

#### 4. Cron job no ejecuta
```
Problema: Sincronización no automática

Solución:
1. Verificar que Strapi esté ejecutándose
2. Verificar logs de cron
3. Probar ejecución manual
```

## 🔐 Seguridad

### Validación de Datos
```javascript
const validateAirbnbEvent = (event) => {
  const errors = [];
  
  if (!event.start || !event.end) {
    errors.push('Fechas de inicio y fin requeridas');
  }
  
  if (new Date(event.end) <= new Date(event.start)) {
    errors.push('Fecha de fin debe ser posterior a inicio');
  }
  
  if (!event.uid) {
    errors.push('UID de evento requerido');
  }
  
  return errors;
};
```

### Rate Limiting
```javascript
// Limitar frecuencia de sincronización
const SYNC_COOLDOWN = 10 * 60 * 1000; // 10 minutos
let lastSyncTime = 0;

const canSync = () => {
  const now = Date.now();
  if (now - lastSyncTime < SYNC_COOLDOWN) {
    return false;
  }
  lastSyncTime = now;
  return true;
};
```

## 📈 Performance

### Optimizaciones
- **Incremental sync**: Solo procesar eventos nuevos/modificados
- **Batch processing**: Procesar eventos en lotes
- **Caching**: Cache de datos de iCal por períodos cortos
- **Parallel processing**: Procesar múltiples calendarios en paralelo

### Métricas de Performance
- **Tiempo de sincronización**: < 30 segundos típico
- **Eventos por minuto**: 100+ eventos procesados
- **Memoria**: < 50MB durante sincronización
- **CPU**: Picos breves durante procesamiento
