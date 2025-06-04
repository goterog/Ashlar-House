// Test simple para ejecutar desde Node.js
console.log('=== TEST SIMPLE ASHLAR HOUSE ===');

// Cargar variables de entorno
require('dotenv').config();

console.log('API Key 1:', process.env.CALLMEBOT_API_KEY_1);
console.log('API Key 2:', process.env.CALLMEBOT_API_KEY_2);

if (!process.env.CALLMEBOT_API_KEY_1) {
    console.log('ERROR: No hay API keys. Verifica el archivo .env');
    process.exit(1);
}

// Test básico de WhatsApp
const https = require('https');

const phoneNumber = '+5218119936655';
const apiKey = process.env.CALLMEBOT_API_KEY_1;
const message = 'Test Ashlar House - ' + new Date().toLocaleString('es-MX');

console.log('Enviando a:', phoneNumber);
console.log('Mensaje:', message);

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
            console.log('SUCCESS: Mensaje enviado');
            console.log('Revisa WhatsApp en 1-3 minutos');
        } else {
            console.log('ERROR: Fallo en el envío');
        }
    });
});

req.on('error', err => {
    console.log('ERROR de conexión:', err.message);
});

req.setTimeout(10000, () => {
    console.log('TIMEOUT');
    req.destroy();
});

console.log('Request enviado, esperando respuesta...');
