console.log('🚀 Iniciando Strapi - Ashlar House');
console.log('Presiona Ctrl+C para detener Strapi');
console.log('Ve a http://localhost:1337/admin para acceder');
console.log('=====================================\n');

// Importar Strapi
const strapi = require('@strapi/strapi');

// Configurar variables de entorno
require('dotenv').config();

// Verificar configuración
console.log('📋 Configuración verificada:');
console.log(`✅ API Key 1: ${process.env.CALLMEBOT_API_KEY_1}`);
console.log(`✅ API Key 2: ${process.env.CALLMEBOT_API_KEY_2}`);
console.log(`✅ Node.js: ${process.version}`);
console.log(`✅ Directorio: ${process.cwd()}\n`);

// Iniciar Strapi
strapi({ distDir: './dist' }).start();
