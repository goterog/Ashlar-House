console.log('🚀 Iniciando prueba simple del sistema WhatsApp');
console.log('Node.js version:', process.version);
console.log('Directorio actual:', process.cwd());

// Cargar variables de entorno
require('dotenv').config();
console.log('CALLMEBOT_API_KEY configurado:', !!process.env.CALLMEBOT_API_KEY);

console.log('✅ Script ejecutado correctamente');
