/**
 * Script para probar WhatsApp con una sola API key
 */

require('dotenv').config();

async function testSingleWhatsApp() {
  console.log('🧪 PRUEBA INDIVIDUAL - CallMeBot WhatsApp');
  console.log('=========================================\n');
  
  const phoneNumber = '5218119936655';
  const apiKey = process.env.CALLMEBOT_API_KEY_1;
  const message = 'Prueba individual desde Ashlar House - ' + new Date().toLocaleString('es-MX');
  
  console.log(`📱 Enviando a: ${phoneNumber}`);
  console.log(`🔑 API Key: ${apiKey ? apiKey.substring(0, 3) + '***' : 'NO CONFIGURADA'}`);
  console.log(`💬 Mensaje: ${message}\n`);
  
  if (!apiKey || apiKey === 'PENDIENTE_SEGUNDO_NUMERO') {
    console.log('❌ API Key no configurada');
    return;
  }
  
  try {
    // Try to use fetch (Node 18+) or fall back to require
    let fetch;
    try {
      fetch = global.fetch || require('node-fetch');
    } catch (e) {
      const { default: nodeFetch } = await import('node-fetch');
      fetch = nodeFetch;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
    
    console.log('🌐 Enviando request a CallMeBot...');
    console.log(`🔗 URL: ${url.substring(0, 80)}...`);
    
    const response = await fetch(url);
    const responseText = await response.text();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Respuesta: ${responseText}`);
    
    if (response.ok) {
      console.log('✅ ¡Mensaje enviado exitosamente!');
      console.log('📲 Revisa tu WhatsApp en unos segundos...');
    } else {
      console.log('❌ Error en el envío');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('📋 Stack:', error.stack);
  }
}

testSingleWhatsApp().catch(console.error);
