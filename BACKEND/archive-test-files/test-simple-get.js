// Test simple para verificar middleware
console.log('🚀 Iniciando test simple del middleware...');

async function testGet() {
  try {
    console.log('📤 Haciendo petición GET a /api/bookings...');
    
    const response = await fetch('http://localhost:1337/api/bookings?pagination[limit]=1');
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ GET exitoso - Total bookings:', result.meta.pagination.total);
      console.log('🔍 AHORA REVISA LA CONSOLA DE STRAPI para ver si aparecen logs del middleware');
    } else {
      console.log('❌ Error en GET:', response.status);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGet();
