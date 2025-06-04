console.log('🚀 Iniciando test final del sistema Ashlar House');
console.log('Fecha:', new Date().toLocaleString('es-MX'));

require('dotenv').config();
const https = require('https');

const phoneNumber = '+5218119936655';
const apiKey = process.env.CALLMEBOT_API_KEY_1;
const message = '🏠 ASHLAR HOUSE - Test final del sistema ✅';

console.log('Enviando a:', phoneNumber);
console.log('Con API key:', apiKey);

const encodedMessage = encodeURIComponent(message);
const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;

console.log('URL:', url.substring(0, 100) + '...');

const req = https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ ¡ÉXITO! Sistema funcionando');
      console.log('📱 Revisa WhatsApp en 1-3 minutos');
    } else {
      console.log('❌ Error en el envío');
    }
  });
});

req.on('error', err => console.log('Error:', err.message));
req.setTimeout(10000, () => {
  console.log('Timeout');
  req.destroy();
});

console.log('Request enviado, esperando...');
