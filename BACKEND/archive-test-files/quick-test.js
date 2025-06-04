/**
 * Test rápido con formato correcto (+)
 */

require('dotenv').config();

async function quickTest() {
  console.log('⚡ TEST RÁPIDO - Formato Correcto (+)');
  console.log('===================================\n');
  
  const phoneNumber = '+5218119936655';  // CON el signo +
  const apiKey = process.env.CALLMEBOT_API_KEY_1;
  const message = '🏠 Ashlar House - Test formato correcto ' + new Date().toLocaleTimeString('es-MX');
  
  console.log(`📱 Número: ${phoneNumber}`);
  console.log(`🔑 API Key: ${apiKey}`);
  console.log(`💬 Mensaje: ${message}\n`);
  
  if (!apiKey) {
    console.log('❌ API Key no configurada');
    return;
  }
  
  try {
    let fetch;
    try {
      fetch = globalThis.fetch || (await import('node-fetch')).default;
    } catch (e) {
      console.log('❌ Error con fetch');
      return;
    }
    
    // NO eliminar el + del número, solo espacios y guiones
    const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
    
    console.log(`🔗 URL: ${url.substring(0, 120)}...`);
    console.log('\n🚀 Enviando...');
    
    const startTime = Date.now();
    const response = await fetch(url, { timeout: 15000 });
    const endTime = Date.now();
    const responseText = await response.text();
    
    console.log(`⏱️  Tiempo: ${endTime - startTime}ms`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response: "${responseText}"`);
    
    if (response.status === 200) {
      if (responseText.toLowerCase().includes('sent') || responseText.toLowerCase().includes('success')) {
        console.log('\n✅ ¡ÉXITO! Mensaje enviado');
        console.log('📲 Revisa tu WhatsApp en 1-3 minutos');
      } else {
        console.log('\n⚠️  Respuesta inesperada de CallMeBot');
      }
    } else {
      console.log(`\n❌ Error HTTP ${response.status}`);
    }
    
  } catch (error) {
    console.log(`\n💥 Error: ${error.message}`);
  }
}

quickTest().catch(console.error);
