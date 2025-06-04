/**
 * Test básico con logging detallado
 */

console.log('🚀 Iniciando test básico...');

require('dotenv').config();

console.log('📋 Variables de entorno:');
console.log(`CALLMEBOT_API_KEY_1: ${process.env.CALLMEBOT_API_KEY_1 || 'NO DEFINIDA'}`);
console.log(`CALLMEBOT_API_KEY_2: ${process.env.CALLMEBOT_API_KEY_2 || 'NO DEFINIDA'}`);

console.log('\n🔧 Probando módulos...');

try {
  const https = require('https');
  console.log('✅ Módulo https cargado');
  
  const { URL } = require('url');
  console.log('✅ Módulo URL cargado');
  
  console.log('\n📱 Preparando test de envío...');
  
  const phoneNumber = '+5218119936655';
  const apiKey = process.env.CALLMEBOT_API_KEY_1;
  const message = `🏠 Test Ashlar House - ${new Date().toLocaleString('es-MX')}`;
  
  console.log(`📞 Número: ${phoneNumber}`);
  console.log(`🔑 API Key: ${apiKey}`);
  console.log(`💬 Mensaje: ${message}`);
  
  if (!apiKey) {
    console.log('❌ No hay API key configurada');
    process.exit(1);
  }
  
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
  
  console.log(`🔗 URL: ${url.substring(0, 120)}...`);
  
  console.log('\n🚀 Enviando request...');
  
  const req = https.get(url, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
      console.log(`📨 Recibiendo data: ${chunk}`);
    });
    
    res.on('end', () => {
      console.log(`📄 Response completa: "${data}"`);
      
      if (res.statusCode === 200) {
        console.log('✅ ¡Éxito! Mensaje enviado');
        console.log('📲 Revisa WhatsApp en 1-3 minutos');
      } else {
        console.log(`❌ Error HTTP ${res.statusCode}`);
      }
      
      console.log('\n🏁 Test completado');
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ Error de request: ${error.message}`);
    console.log(`🔍 Error code: ${error.code}`);
    console.log(`📚 Stack: ${error.stack}`);
  });
  
  req.setTimeout(15000, () => {
    console.log('⏰ Timeout de 15 segundos');
    req.destroy();
  });
  
  console.log('⏳ Request enviado, esperando respuesta...');
  
} catch (error) {
  console.log(`💥 Error general: ${error.message}`);
  console.log(`📚 Stack: ${error.stack}`);
}
