// Test simple de conectividad
console.log('🔍 Test de conectividad básica...');

async function testBasicConnectivity() {
  try {
    // Verificar que fetch está disponible
    if (typeof fetch === 'undefined') {
      console.log('❌ fetch no está disponible en esta versión de Node.js');
      return false;
    }
    
    console.log('✅ fetch está disponible');
    
    // Intentar conectar con Strapi
    console.log('📡 Intentando conectar con Strapi en localhost:1337...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch('http://localhost:1337', {
        signal: controller.signal,
        headers: { 'Accept': 'text/html,application/json' }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ Strapi está corriendo y responde correctamente');
        console.log(`   Status: ${response.status} ${response.statusText}`);
        return true;
      } else {
        console.log(`⚠️ Strapi responde pero con error: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.log('❌ Timeout: Strapi no responde en 5 segundos');
      } else {
        console.log('❌ Error de conexión:', error.message);
      }
      console.log('');
      console.log('🚀 Para iniciar Strapi ejecuta en otra terminal:');
      console.log('   npm run develop');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    return false;
  }
}

testBasicConnectivity().then(success => {
  if (success) {
    console.log('');
    console.log('🎯 Strapi está listo. Ahora puedes ejecutar:');
    console.log('   node test-final-lifecycle.js');
  }
});
