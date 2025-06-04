// Test para verificar si lifecycle hooks funcionan con operaciones de API
console.log('🧪 TESTING API LIFECYCLE HOOKS');
console.log('====================================');

const https = require('https');

async function testAPIBooking() {
  const bookingData = {
    data: {
      title: 'Test API Lifecycle',
      start: '2025-06-05',
      end: '2025-06-06',
      estado: 'Reservado',
      source: 'Landing page',
      name: 'Test User API',
      email: 'test@api.com',
      phone: '+52-555-123456',
      guest: '2',
      message: 'Test desde API para verificar lifecycle hooks'
    }
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(bookingData);
    
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('📤 Enviando POST a /api/bookings...');
    console.log('Datos:', JSON.stringify(bookingData, null, 2));

    const req = https.request(options, (res) => {
      console.log('📊 Response status:', res.statusCode);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 201) {
            const result = JSON.parse(responseData);
            console.log('✅ Booking creado:', result.data.id);
            console.log('📋 Estado:', result.data.estado);
            console.log('\n⏰ Esperando logs del lifecycle hook en la consola de Strapi...');
            console.log('Deberías ver: 🚀🚀🚀 LIFECYCLE HOOK EJECUTADO! 🚀🚀🚀');
            resolve(result);
          } else {
            console.log('❌ Error response:', responseData);
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (error) {
          console.log('❌ Error parsing response:', error.message);
          console.log('Response data:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Usar http en lugar de https para localhost
const http = require('http');

async function testAPIBookingHTTP() {
  const bookingData = {
    data: {
      title: 'Test API Lifecycle',
      start: '2025-06-05',
      end: '2025-06-06',
      estado: 'Reservado',
      source: 'Landing page',
      name: 'Test User API',
      email: 'test@api.com',
      phone: '+52-555-123456',
      guest: '2',
      message: 'Test desde API para verificar lifecycle hooks'
    }
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(bookingData);
    
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('📤 Enviando POST a http://localhost:1337/api/bookings...');
    console.log('Datos:', JSON.stringify(bookingData, null, 2));

    const req = http.request(options, (res) => {
      console.log('📊 Response status:', res.statusCode);
      console.log('📊 Response headers:', res.headers);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 201) {
            const result = JSON.parse(responseData);
            console.log('✅ Booking creado exitosamente!');
            console.log('📋 ID:', result.data.id);
            console.log('📋 Estado:', result.data.estado);
            console.log('\n⏰ AHORA REVISA LA CONSOLA DE STRAPI...');
            console.log('Deberías ver: 🚀🚀🚀 LIFECYCLE HOOK EJECUTADO! 🚀🚀🚀');
            resolve(result);
          } else {
            console.log('❌ Error response:', responseData);
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (error) {
          console.log('❌ Error parsing response:', error.message);
          console.log('Raw response:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

testAPIBookingHTTP().catch(console.error);
