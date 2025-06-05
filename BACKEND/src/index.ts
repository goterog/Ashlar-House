// import type { Core } from '@strapi/strapi';
import * as cron from 'node-cron';
import axios from 'axios';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 WhatsApp Bootstrap - Configurando lifecycle hooks...');
    
    // Configurar importación automática de Airbnb cada 3 horas + 10 minutos
    // Airbnb actualiza a las 12:00, 3:00, 6:00, 9:00, 12:00, 15:00, 18:00, 21:00
    // Nosotros sincronizamos a las 12:10, 3:10, 6:10, 9:10, 12:10, 15:10, 18:10, 21:10
    console.log('📅 Configurando sincronización automática con Airbnb cada 3 horas (10 min después)...');
    cron.schedule('10 */3 * * *', async () => {
      console.log('🔄 Iniciando sincronización programada con Airbnb...');
      try {
        await importAirbnbCalendar(strapi);
        console.log('✅ Sincronización programada completada exitosamente');
      } catch (error) {
        console.error('❌ Error en sincronización programada:', error);
      }
    });

    // Ejecutar importación inicial al arrancar (opcional)
    console.log('🔄 Ejecutando importación inicial de Airbnb...');
    try {
      await importAirbnbCalendar(strapi);
      console.log('✅ Importación inicial completada');
    } catch (error) {
      console.error('❌ Error en importación inicial:', error);
    }
    
    // Escuchar eventos del entity service
    strapi.db.lifecycles.subscribe({
      models: ['api::booking.booking'],
      async afterCreate(event) {
        console.log('🎯 LIFECYCLE HOOK EJECUTADO - Nueva reserva creada!');
        console.log('📝 Booking ID:', event.result.id);
        
        try {
          // Obtener los detalles completos de la reserva
          const booking = await strapi.entityService.findOne('api::booking.booking', event.result.id, {
            populate: '*'
          });
          
          console.log('📋 Booking obtenido:', booking.estado, booking.start, booking.end);
          
          // Enviar notificación WhatsApp
          await sendWhatsAppNotification(booking, strapi);
          console.log('✅ Notificación WhatsApp enviada exitosamente');
          
        } catch (error) {
          console.error('❌ Error en lifecycle hook:', error);
        }
      }
    });
  },
};

// Función para enviar WhatsApp usando CallMeBot API
async function sendWhatsAppNotification(booking: any, strapi: any): Promise<void> {
  try {
    // Formatear mensaje según los requisitos
    const startDate = new Date(booking.start);
    const endDate = new Date(booking.end);
    
    // Verificar si es un solo día (comparar fechas sin tiempo)
    const isSingleDay = startDate.toDateString() === endDate.toDateString();
    
    let message = '';
    
    if (booking.estado === 'Bloqueado') {
      message = isSingleDay 
        ? `Se ha ${booking.estado.toLowerCase()} el día ${formatDate(booking.start)} desde ${booking.source || 'Otra'}`
        : `Se han ${booking.estado.toLowerCase()} los días ${formatDate(booking.start)} al ${formatDate(booking.end)} desde ${booking.source || 'Otra'}`;
    } else if (booking.estado === 'Reservado') {
      message = isSingleDay 
        ? `Se ha ${booking.estado.toLowerCase()} el día ${formatDate(booking.start)} desde ${booking.source || 'Otra'}`
        : `Se han ${booking.estado.toLowerCase()} los días ${formatDate(booking.start)} al ${formatDate(booking.end)} desde ${booking.source || 'Otra'}`;
      
      // Añadir datos del cliente si existen (solo para reservas)
      const clientData = [];
      if (booking.name) clientData.push(`Nombre: ${booking.name}`);
      if (booking.guest) clientData.push(`Número de huéspedes: ${booking.guest}`);
      if (booking.phone) clientData.push(`Teléfono: ${booking.phone}`);
      if (booking.email) clientData.push(`E-mail: ${booking.email}`);
      if (booking.message) clientData.push(`Mensaje del huésped: ${booking.message}`);
      
      if (clientData.length > 0) {
        message += '\n\nCon los siguientes datos de reservación:\n' + clientData.join('\n');
      }
    }
    
    // Solo enviar notificación si el estado es Bloqueado o Reservado
    if (booking.estado === 'Bloqueado' || booking.estado === 'Reservado') {
      console.log(`📱 Enviando notificaciones WhatsApp para booking ID: ${booking.id}`);
      
      // Lista de números a notificar
      const phoneNumbers = ['+5218119936655', '+5218111755533'];
      
      // Enviar a ambos números
      const promises = phoneNumbers.map(phoneNumber => 
        sendWhatsAppMessage(phoneNumber, message, strapi)
      );
      
      await Promise.allSettled(promises);
      console.log(`✅ Notificaciones WhatsApp procesadas para reserva ID: ${booking.id}`);
    } else {
      console.log(`⚠️ Estado '${booking.estado}' no requiere notificación WhatsApp`);
    }
    
  } catch (error) {
    console.error('❌ Error en sendWhatsAppNotification:', error);
    throw error;
  }
}

// Función para formatear fechas
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit' as const, 
    month: '2-digit' as const, 
    year: 'numeric' as const 
  };
  return new Date(dateString).toLocaleDateString('es-MX', options);
}

// Función para enviar mensaje WhatsApp usando CallMeBot API
async function sendWhatsAppMessage(phoneNumber: string, message: string, strapi: any): Promise<string> {
  try {
    // CallMeBot requiere que el número esté registrado previamente
    const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
    
    // Seleccionar la API key correcta según el número
    let apiKey;
    if (cleanPhoneNumber === '+5218119936655') {
      apiKey = process.env.CALLMEBOT_API_KEY_1;
    } else if (cleanPhoneNumber === '+5218111755533') {
      apiKey = process.env.CALLMEBOT_API_KEY_2;
    } else {
      throw new Error(`Número de teléfono no configurado: ${phoneNumber}`);
    }
    
    if (!apiKey) {
      throw new Error(`API key no configurada para el número ${phoneNumber}`);
    }
    
    // Para la URL, necesitamos el número sin el +
    const phoneForURL = cleanPhoneNumber.replace('+', '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneForURL}&text=${encodedMessage}&apikey=${apiKey}`;
    
    console.log(`🔔 Enviando WhatsApp a ${phoneNumber}: ${message.substring(0, 50)}...`);
    
    // Usar fetch nativo en Node.js 18+
    const response = await fetch(url);
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${responseText}`);
    }
    
    console.log(`✅ WhatsApp enviado exitosamente a ${phoneNumber}`);
    return responseText;
    
  } catch (error) {
    console.error(`❌ Error enviando WhatsApp a ${phoneNumber}:`, error.message);
    throw error;
  }
}

// ==================== FUNCIONES DE IMPORTACIÓN AIRBNB ====================

const AIRBNB_ICS_URL = 'https://www.airbnb.mx/calendar/ical/807381707673543946.ics?s=9789cc909449839e93a1202f822e9c8d';

// Convierte YYYYMMDD a YYYY-MM-DD (ISO)
function formatDateISO(yyyymmdd: string): string {
  const year = yyyymmdd.substring(0, 4);
  const month = yyyymmdd.substring(4, 6);
  const day = yyyymmdd.substring(6, 8);
  return `${year}-${month}-${day}`;
}

function mapEstado(summary: string): string {
  if (!summary) return 'Reservado';
  if (summary.toLowerCase().includes('reserved')) return 'Reservado';
  if (summary.toLowerCase().includes('not available')) return 'Bloqueado';
  return 'Disponible';
}

// Función mejorada para extraer URL de reservación
function extractReservationURL(description: string): string {
  if (!description) return '';
  
  // Limpiar caracteres de escape comunes primero
  let cleanDescription = description.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
  
  // Buscar el patrón "Reservation URL:" seguido de la URL
  const urlMatch = cleanDescription.match(/Reservation URL:\s*(https?:\/\/[^\s\n\r\\]+)/i);
  if (urlMatch) {
    let url = urlMatch[1];
    
    // Limpiar caracteres no válidos al final de la URL
    url = url.replace(/[.,;!?\s\r\n\\]+$/, ''); // Remover puntuación, espacios y escapes al final
    
    // Cambiar .com por .mx si es necesario para que sea consistente
    url = url.replace('airbnb.com', 'airbnb.mx');
    
    return url;
  }
  
  // Buscar cualquier URL que contenga airbnb como fallback
  const airbnbMatch = cleanDescription.match(/(https?:\/\/[^\s\n\r\\]*airbnb[^\s\n\r\\]*)/i);
  if (airbnbMatch) {
    let url = airbnbMatch[1];
    url = url.replace(/[.,;!?\s\r\n\\]+$/, '');
    url = url.replace('airbnb.com', 'airbnb.mx');
    return url;
  }
  
  // Buscar cualquier URL como último recurso
  const genericUrlMatch = cleanDescription.match(/(https?:\/\/[^\s\n\r\\]+)/i);
  if (genericUrlMatch) {
    let url = genericUrlMatch[1];
    url = url.replace(/[.,;!?\s\r\n\\]+$/, '');
    return url;
  }
  
  // Si no se encuentra URL, devolver la descripción completa limpia sin caracteres de escape
  return cleanDescription.replace(/\\n.*$/, '').trim();
}

async function bookingExists(uid: string, strapi: any): Promise<boolean> {
  try {
    const existingBookings = await strapi.entityService.findMany('api::booking.booking', {
      filters: { UID: { $eq: uid } },
      pagination: { limit: 1 }
    });
    return existingBookings && existingBookings.length > 0;
  } catch (err) {
    console.error('Error buscando UID:', uid, err.message);
    return false;
  }
}

async function importAirbnbCalendar(strapi: any): Promise<void> {
  try {
    console.log('📥 Descargando calendario de Airbnb...');
    
    // Descarga el .ics directamente de Airbnb
    const response = await axios.get(AIRBNB_ICS_URL);
    const ics = response.data;
    const events = ics.split('BEGIN:VEVENT').slice(1);

    console.log(`📊 Encontrados ${events.length} eventos en el calendario`);

    let imported = 0;
    let skipped = 0;

    for (const eventRaw of events) {
      // Mejorar el parsing para manejar líneas continuadas del formato iCal
      const rawLines = eventRaw.split('\n');
      let start, end, summary, description, uid;

      // Reconstituir líneas que pueden estar divididas (formato iCal folding)
      const reconstructedLines = [];
      let currentLine = '';
      
      for (const line of rawLines) {
        // En iCal, las líneas continuadas empiezan con espacio o tab
        if ((line.startsWith(' ') || line.startsWith('\t')) && currentLine) {
          // Línea continuada (iCal fold) - remover el espacio/tab inicial
          currentLine += line.substring(1);
        } else {
          if (currentLine) reconstructedLines.push(currentLine.trim());
          currentLine = line.trim();
        }
      }
      if (currentLine) reconstructedLines.push(currentLine.trim());

      // Parsear las líneas reconstruidas
      for (const line of reconstructedLines) {
        if (line.startsWith('DTSTART')) start = line.split(':')[1];
        if (line.startsWith('DTEND')) end = line.split(':')[1];
        if (line.startsWith('SUMMARY')) summary = line.split(':')[1];
        if (line.startsWith('DESCRIPTION')) {
          description = line.substring(line.indexOf(':') + 1);
        }
        if (line.startsWith('UID')) uid = line.split(':')[1];
      }

      if (!start || !end || !summary || !uid) continue;

      // Checa si ya existe el booking con ese UID
      const exists = await bookingExists(uid, strapi);
      if (exists) {
        console.log(`⏭️ Booking con UID ${uid} ya existe, omitido.`);
        skipped++;
        continue;
      }

      // Formatea fechas a ISO
      const startDate = formatDateISO(start);
      const endDate = formatDateISO(end);

      // Extrae la URL de reservación mejorada
      const reservationURL = extractReservationURL(description || '');

      const booking = {
        title: summary,
        start: startDate,
        end: endDate,
        estado: mapEstado(summary),
        source: 'Airbnb',
        guest: '',
        name: '',
        email: '',
        phone: '',
        message: reservationURL, // Aquí va la URL extraída
        UID: uid,
      };

      try {
        const result = await strapi.entityService.create('api::booking.booking', {
          data: booking
        });
        console.log(`✅ Importado: ${booking.title} (${booking.start} - ${booking.end})`);
        imported++;
      } catch (err) {
        console.error('❌ Error importando:', booking, err.response?.data || err.message);
      }
    }

    console.log(`🎉 Importación completada: ${imported} nuevos, ${skipped} omitidos`);
  } catch (error) {
    console.error('❌ Error en importación de Airbnb:', error);
    throw error;
  }
}
