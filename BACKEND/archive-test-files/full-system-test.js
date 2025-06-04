/**
 * Test completo del sistema WhatsApp con ambas API keys
 */

require('dotenv').config();

async function fullSystemTest() {
  console.log('🚀 PRUEBA COMPLETA DEL SISTEMA WHATSAPP');
  console.log('======================================\n');
  
  // Configuración
  const phoneConfigs = [
    {
      name: 'Primer número',
      phone: '+5218119936655',
      apiKey: process.env.CALLMEBOT_API_KEY_1
    },
    {
      name: 'Segundo número', 
      phone: '+5218111755533',
      apiKey: process.env.CALLMEBOT_API_KEY_2
    }
  ];
  
  console.log('📋 CONFIGURACIÓN:');
  phoneConfigs.forEach((config, index) => {
    console.log(`   ${index + 1}. ${config.name}: ${config.phone}`);
    console.log(`      API Key: ${config.apiKey ? '✅ ' + config.apiKey : '❌ No configurada'}`);
  });
  console.log();
  
  // Obtener fetch
  let fetch;
  try {
    fetch = globalThis.fetch || (await import('node-fetch')).default;
  } catch (e) {
    console.log('❌ Error importando fetch');
    return;
  }
  
  // Test de cada número
  for (let i = 0; i < phoneConfigs.length; i++) {
    const config = phoneConfigs[i];
    console.log(`📱 TEST ${i + 1}/2: ${config.name}`);
    console.log('─'.repeat(50));
    
    if (!config.apiKey || config.apiKey === 'PENDIENTE_SEGUNDO_NUMERO') {
      console.log(`   ❌ API Key no configurada para ${config.phone}`);
      console.log();
      continue;
    }
    
    try {
      const message = `🏠 Ashlar House - Test completo ${i + 1}/2 - ${new Date().toLocaleTimeString('es-MX')}`;
      
      // Limpiar número (mantener +, eliminar espacios y guiones)
      const cleanPhoneNumber = config.phone.replace(/[-\s]/g, '');
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhoneNumber}&text=${encodedMessage}&apikey=${config.apiKey}`;
      
      console.log(`   📞 Enviando a: ${config.phone}`);
      console.log(`   💬 Mensaje: ${message}`);
      console.log(`   🔗 URL: ${url.substring(0, 100)}...`);
      
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        timeout: 20000,
        headers: {
          'User-Agent': 'Ashlar-House-System/1.0'
        }
      });
      
      const endTime = Date.now();
      const responseText = await response.text();
      
      console.log(`   ⏱️  Tiempo: ${endTime - startTime}ms`);
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   📄 Respuesta: "${responseText}"`);
      
      if (response.status === 200) {
        if (responseText.toLowerCase().includes('sent') || responseText.toLowerCase().includes('success')) {
          console.log(`   ✅ ¡ÉXITO! Mensaje enviado a ${config.phone}`);
        } else {
          console.log(`   ⚠️  Respuesta inesperada para ${config.phone}`);
        }
      } else {
        console.log(`   ❌ Error HTTP ${response.status} para ${config.phone}`);
      }
      
    } catch (error) {
      console.log(`   💥 Error enviando a ${config.phone}: ${error.message}`);
    }
    
    console.log();
    
    // Pausa entre envíos
    if (i < phoneConfigs.length - 1) {
      console.log('⏱️  Esperando 3 segundos antes del siguiente envío...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('🎉 PRUEBA COMPLETA FINALIZADA');
  console.log('📲 Revisa ambos números de WhatsApp en los próximos 3 minutos');
  console.log('🔄 Si recibiste los mensajes, el sistema está listo para producción');
}

fullSystemTest().catch(error => {
  console.error('💥 Error en prueba completa:', error.message);
  console.error('📚 Stack:', error.stack);
});
