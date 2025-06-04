// Verificación simple de conexión con Strapi
console.log('🔍 Verificando conexión con Strapi...');

async function checkStrapi() {
  try {
    const response = await fetch('http://localhost:1337', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      console.log('✅ Strapi está corriendo correctamente');
      console.log(`   Status: ${response.status}`);
      return true;
    } else {
      console.log('❌ Strapi respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ No se puede conectar con Strapi:', error.message);
    console.log('');
    console.log('🚀 Para iniciar Strapi ejecuta: npm run develop');
    return false;
  }
}

checkStrapi();
