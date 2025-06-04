// Simulación directa del lifecycle
console.log('=== SIMULACION LIFECYCLE ===');

require('dotenv').config();

// Mock de strapi
global.strapi = {
    log: {
        info: console.log,
        error: console.error,
        warn: console.warn
    }
};

// Cargar lifecycle
const lifecycle = require('../src/api/booking/content-types/booking/lifecycles.js');

// Datos de prueba que simulan una reserva real
const testBooking = {
    id: 123,
    estado: 'Reservado',  // Asegúrate de que sea exactamente así
    start: new Date().toISOString(),
    end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    source: 'Landing Page',
    name: 'Cliente de Prueba',
    guest: 2,
    phone: '+52-81-1234-5678',
    email: 'test@ashlarhouse.com',
    message: 'Reserva de prueba'
};

console.log('Datos de la reserva de prueba:');
console.log(JSON.stringify(testBooking, null, 2));

console.log('\nEjecutando lifecycle...');

// Simular el evento de Strapi
const event = { result: testBooking };

lifecycle.afterCreate(event)
    .then(() => {
        console.log('\nLifecycle completado exitosamente');
        console.log('Si funciona, deberías ver logs de WhatsApp arriba');
        console.log('y recibir mensajes en 1-3 minutos');
    })
    .catch(error => {
        console.error('\nError en lifecycle:', error.message);
        console.error('Stack:', error.stack);
    });
