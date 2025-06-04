/**
 * Script de diagnóstico completo para CallMeBot
 */

require('dotenv').config();

async function debugCallMeBot() {
  console.log('🔍 DIAGNÓSTICO CALLMEBOT - Ashlar House');
  console.log('=====================================\n');
  
  // 1. Verificar configuración
  console.log('📋 CONFIGURACIÓN:');
  console.log(`   Node.js version: ${process.version}`);
  console.log(`   Current time: ${new Date().toISOString()}`);
  console.log(`   CALLMEBOT_API_KEY_1: ${process.env.CALLMEBOT_API_KEY_1 ? '✅ Configurado (' + process.env.CALLMEBOT_API_KEY_1 + ')' : '❌ No configurado'}`);
  console.log(`   CALLMEBOT_API_KEY_2: ${process.env.CALLMEBOT_API_KEY_2 ? '✅ Configurado (' + process.env.CALLMEBOT_API_KEY_2 + ')' : '❌ No configurado'}`);
  console.log();
  
  // 2. Test de conectividad básica
  console.log('🌐 TEST DE CONECTIVIDAD:');
  try {
    // Import fetch properly
    let fetch;
    try {
      // Try global fetch first (Node 18+)
      fetch = globalThis.fetch;
      if (!fetch) {
        // Fall back to node-fetch
        const nodeFetch = await import('node-fetch');
        fetch = nodeFetch.default;
      }
    } catch (e) {
      console.log('❌ Error importando fetch:', e.message);
      return;
    }
    
    // Test basic connectivity
    console.log('   Probando conectividad a CallMeBot...');
    const testResponse = await fetch('https://api.callmebot.com/', {
      method: 'HEAD',
      timeout: 10000
    });
    console.log(`   ✅ CallMeBot responde: ${testResponse.status}`);
  } catch (error) {
    console.log(`   ❌ Error de conectividad: ${error.message}`);
    return;
  }
  
  // 3. Test de envío real
  console.log('\n📱 TEST DE ENVÍO:');
  const phoneNumber = '5218119936655';
  const apiKey = process.env.CALLMEBOT_API_KEY_1;
  const message = `🏠 Test Ashlar House - ${new Date().toLocaleTimeString('es-MX')}`;
  
  if (!apiKey || apiKey === 'PENDIENTE_SEGUNDO_NUMERO') {
    console.log('   ❌ API Key no configurada para el primer número');
    return;
  }
  
  try {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
    
    console.log(`   📞 Número: ${phoneNumber}`);
    console.log(`   🔑 API Key: ${apiKey}`);
    console.log(`   💬 Mensaje: ${message}`);
    console.log(`   🔗 URL construida: ${url.substring(0, 100)}...`);
    console.log();
    
    console.log('   🚀 Enviando request...');
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'GET',
      timeout: 30000,
      headers: {
        'User-Agent': 'Ashlar-House-Notifications/1.0'
      }
    });
    
    const endTime = Date.now();
    const responseText = await response.text();
    
    console.log(`   ⏱️  Tiempo de respuesta: ${endTime - startTime}ms`);
    console.log(`   📊 Status Code: ${response.status}`);
    console.log(`   📄 Response Headers:`, Object.fromEntries(response.headers.entries()));
    console.log(`   📝 Response Body: "${responseText}"`);
    console.log();
    
    // Analizar respuesta
    if (response.status === 200) {
      if (responseText.toLowerCase().includes('sent')) {
        console.log('   ✅ ¡ÉXITO! Mensaje enviado correctamente');
        console.log('   📲 Deberías recibir el mensaje en WhatsApp en 1-3 minutos');
      } else if (responseText.toLowerCase().includes('error')) {
        console.log('   ⚠️  CallMeBot reportó un error:', responseText);
      } else {
        console.log('   🤔 Respuesta inesperada de CallMeBot');
      }
    } else if (response.status === 401) {
      console.log('   ❌ Error de autenticación - API Key inválida');
    } else if (response.status === 404) {
      console.log('   ❌ Número no registrado en CallMeBot');
    } else {
      console.log(`   ❌ Error HTTP ${response.status}: ${responseText}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error en el envío: ${error.message}`);
    if (error.code) {
      console.log(`   🔍 Error code: ${error.code}`);
    }
    if (error.stack) {
      console.log(`   📚 Stack trace: ${error.stack.split('\n').slice(0, 3).join('\n')}`);
    }
  }
  
  console.log('\n📝 RECOMENDACIONES:');
  console.log('   1. Verifica que el número 5218119936655 esté registrado en CallMeBot');
  console.log('   2. Confirma que la API key 4639929 es correcta');
  console.log('   3. Los mensajes de CallMeBot pueden tardar hasta 3 minutos');
  console.log('   4. Revisa la bandeja de spam de WhatsApp');
  console.log('   5. CallMeBot funciona mejor con conexión móvil que WiFi');
}

// Ejecutar diagnóstico
debugCallMeBot().catch(error => {
  console.error('\n💥 ERROR FATAL:', error.message);
  console.error('📚 Stack:', error.stack);
});
