// Test final synchronous
console.log('🚀 ASHLAR HOUSE - Test Final del Sistema WhatsApp');
console.log('==================================================');

require('dotenv').config();

console.log('📋 Configuración:');
console.log(`  API Key 1: ${process.env.CALLMEBOT_API_KEY_1 || 'NO CONFIGURADA'}`);
console.log(`  API Key 2: ${process.env.CALLMEBOT_API_KEY_2 || 'NO CONFIGURADA'}`);
console.log(`  Fecha: ${new Date().toLocaleString('es-MX')}`);

if (!process.env.CALLMEBOT_API_KEY_1) {
  console.log('❌ No hay API keys configuradas');
  process.exit(1);
}

console.log('\n🎯 Creando mensaje de prueba...');

const mensaje = `🏠 *ASHLAR HOUSE - Prueba Final*

📅 Fecha: ${new Date().toLocaleDateString('es-ES')}
⏰ Hora: ${new Date().toLocaleTimeString('es-ES')}
🎯 Tipo: Prueba del sistema completo

✅ ¡El sistema de notificaciones está funcionando!

📱 Si recibes este mensaje, el sistema está 100% operativo.`;

console.log('📝 Mensaje creado:');
console.log(mensaje);

console.log('\n🚀 Realizando llamadas a la API...');

const https = require('https');
const { URL } = require('url');

function testAPI(phoneNumber, apiKey, name) {
  return new Promise((resolve) => {
    console.log(`\n📞 Probando ${name}: ${phoneNumber}`);
    
    const encodedMessage = encodeURIComponent(mensaje);
    const urlString = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
    
    console.log(`🔗 URL (primeros 100 chars): ${urlString.substring(0, 100)}...`);
    
    const startTime = Date.now();
    
    const req = https.get(urlString, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const endTime = Date.now();
        console.log(`📊 Resultado para ${name}:`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Tiempo: ${endTime - startTime}ms`);
        console.log(`   Respuesta: "${data}"`);
        
        if (res.statusCode === 200) {
          console.log(`   ✅ ÉXITO para ${name}`);
        } else {
          console.log(`   ❌ ERROR para ${name}`);
        }
        
        resolve({ success: res.statusCode === 200, response: data, name });
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ERROR DE RED para ${name}: ${error.message}`);
      resolve({ success: false, error: error.message, name });
    });
    
    req.setTimeout(15000, () => {
      console.log(`   ⏰ TIMEOUT para ${name}`);
      req.destroy();
      resolve({ success: false, error: 'Timeout', name });
    });
  });
}

// Ejecutar tests
async function runTests() {
  const tests = [
    testAPI('+5218119936655', process.env.CALLMEBOT_API_KEY_1, 'Número 1'),
    testAPI('+5218111755533', process.env.CALLMEBOT_API_KEY_2, 'Número 2')
  ];
  
  const results = await Promise.all(tests);
  
  console.log('\n📊 RESUMEN FINAL:');
  console.log('=================');
  
  let allSuccess = true;
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}: ${result.success ? 'ÉXITO' : 'FALLÓ'}`);
    if (!result.success) allSuccess = false;
  });
  
  console.log(`\n🎯 RESULTADO GENERAL: ${allSuccess ? '✅ SISTEMA FUNCIONANDO' : '❌ HAY PROBLEMAS'}`);
  
  if (allSuccess) {
    console.log('📱 Revisa ambos números de WhatsApp en 1-3 minutos');
    console.log('🎉 ¡El sistema está listo para producción!');
  } else {
    console.log('🔧 Revisa la configuración y conectividad');
  }
  
  console.log('\n==================================================');
}

runTests().catch(console.error);
