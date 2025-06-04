// Configuración de la API para el frontend
const API_CONFIG = {
  // URL base del backend Strapi
  BASE_URL: 'http://localhost:1337',
  // URL base para producción (descomenta cuando despliegues)
  // BASE_URL: 'https://ashlar-house-backend.onrender.com',
  
  // Endpoints principales
  ENDPOINTS: {
    BOOKINGS: '/api/bookings',
    HERO: '/api/hero',
    UPLOAD: '/api/upload'
  },
  
  // Configuración de notificaciones
  NOTIFICATIONS: {
    WHATSAPP_ENABLED: true,
    PHONE_NUMBERS: ['521-811-993-6655', '521-811-175-5533']
  }
};

// Función para crear una nueva reserva
async function createBooking(bookingData) {
  try {
    console.log('📅 Creando nueva reserva:', bookingData);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKINGS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: bookingData
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Si las notificaciones están habilitadas, mostrar mensaje de confirmación
    if (API_CONFIG.NOTIFICATIONS.WHATSAPP_ENABLED) {
      console.log('📱 Notificaciones WhatsApp enviadas automáticamente');
      
      // Mostrar mensaje al usuario
      showNotificationMessage(result.data);
    }
    
    return result.data;
    
  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    throw error;
  }
}

// Función para mostrar mensaje de confirmación al usuario
function showNotificationMessage(booking) {
  const isBlocked = booking.estado === 'Bloqueado';
  const isReserved = booking.estado === 'Reservado';
  
  if (isBlocked || isReserved) {
    const message = `
      ✅ Reserva ${booking.estado.toLowerCase()} exitosamente
      📱 Se han enviado notificaciones automáticas por WhatsApp
      📅 Fechas: ${formatDate(booking.start)} - ${formatDate(booking.end)}
    `;
    
    // Mostrar en modal o toast notification
    alert(message.trim());
  }
}

// Función para formatear fechas
function formatDate(dateString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-MX', options);
}

// Función para probar las notificaciones desde el frontend
async function testWhatsAppNotifications() {
  const testBooking = {
    title: "Prueba desde Frontend",
    start: "2025-06-10",
    end: "2025-06-10", 
    estado: "Reservado",
    source: "Landing page",
    name: "Usuario de Prueba",
    guest: "2",
    phone: "+52-811-123-4567",
    email: "test@example.com",
    message: "Prueba del sistema de notificaciones"
  };
  
  try {
    await createBooking(testBooking);
    console.log('🎉 Prueba de notificaciones completada');
  } catch (error) {
    console.error('❌ Error en prueba:', error);
  }
}

// Exportar para uso en el HTML
window.API_CONFIG = API_CONFIG;
window.createBooking = createBooking;
window.testWhatsAppNotifications = testWhatsAppNotifications;
