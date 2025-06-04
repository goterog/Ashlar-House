// Test simple y directo
console.log('🚀 Test directo del sistema WhatsApp');

require('dotenv').config();
const https = require('https');

// Simular strapi.log
global.strapi = {
  log: {
    info: console.log,
    error: console.error,
    warn: console.warn
  }
};

// Función del lifecycle (copiada exactamente)
async function sendWhatsAppMessage(phoneNumber, message, apiKey) {
  return new Promise((resolve, reject) => {
    try {
      const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
      
      if (!apiKey || apiKey === 'PENDIENTE_SEGUNDO_NUMERO') {
        strapi.log.warn(`API key no configurada para ${phoneNumber} - no se enviará notificación WhatsApp`);
        resolve();
        return;
      }
      
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
      
      strapi.log.info(`Enviando WhatsApp a ${phoneNumber}: ${message.substring(0, 50)}...`);
      
      const req = https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            strapi.log.info(`WhatsApp enviado exitosamente a ${phoneNumber}`);
            console.log(`📱 ÉXITO para ${phoneNumber}: ${data}`);
            resolve(data);
          } else {
            const error = new Error(`Error ${res.statusCode}: ${data}`);
            strapi.log.error(`Error enviando WhatsApp a ${phoneNumber}:`, error.message);
            console.log(`❌ ERROR para ${phoneNumber}: ${res.statusCode} - ${data}`);
            reject(error);
          }
        });
      });
      
      req.on('error', (error) => {
        strapi.log.error(`Error enviando WhatsApp a ${phoneNumber}:`, error.message);
        console.log(`❌ ERROR DE RED para ${phoneNumber}: ${error.message}`);
        reject(error);
      });
      
      req.setTimeout(10000, () => {
        req.abort();
        const error = new Error('Timeout sending WhatsApp message');
        strapi.log.error(`Timeout enviando WhatsApp a ${phoneNumber}`);
        console.log(`⏰ TIMEOUT para ${phoneNumber}`);
        reject(error);
      });
      
    } catch (error) {
      strapi.log.error(`Error general enviando WhatsApp a ${phoneNumber}:`, error.message);
      console.log(`💥 ERROR GENERAL para ${phoneNumber}: ${error.message}`);
      reject(error);
    }
  });
}

// Test directo
async function testDirect() {
  console.log('Configuración:');
  console.log(`API Key 1: ${process.env.CALLMEBOT_API_KEY_1}`);
  console.log(`API Key 2: ${process.env.CALLMEBOT_API_KEY_2}`);
  
  const message = `🏠 ASHLAR HOUSE - Test directo
📅 ${new Date().toLocaleDateString('es-MX')}
✅ Sistema funcionando`;
  
  console.log('\n📱 Enviando a primer número...');
  try {
    await sendWhatsAppMessage('+5218119936655', message, process.env.CALLMEBOT_API_KEY_1);
  } catch (e) {
    console.log('Error en primer número:', e.message);
  }
  
  console.log('\n📱 Enviando a segundo número...');
  try {
    await sendWhatsAppMessage('+5218111755533', message, process.env.CALLMEBOT_API_KEY_2);
  } catch (e) {
    console.log('Error en segundo número:', e.message);
  }
  
  console.log('\n🏁 Test completado');
}

testDirect();
