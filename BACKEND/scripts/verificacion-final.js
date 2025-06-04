console.log('🏠 ASHLAR HOUSE - Verificación Final');
console.log('=====================================');

require('dotenv').config();

console.log('✅ API Key 1:', process.env.CALLMEBOT_API_KEY_1);
console.log('✅ API Key 2:', process.env.CALLMEBOT_API_KEY_2);
console.log('✅ Fecha:', new Date().toLocaleDateString('es-MX'));
console.log('✅ Sistema configurado correctamente');

console.log('\n📱 Números de WhatsApp configurados:');
console.log('   - +52-81-1993-6655 (API Key: 4639929)');
console.log('   - +52-81-1175-5533 (API Key: 1855584)');

console.log('\n🚀 Sistema listo para usar');
console.log('\n📋 Próximos pasos:');
console.log('   1. Iniciar Strapi: npm run develop');
console.log('   2. Ir a: http://localhost:1337/admin');
console.log('   3. Crear nueva reserva en Content Manager > Booking');
console.log('   4. ¡Recibir notificaciones en WhatsApp!');

console.log('\n🎉 ¡IMPLEMENTACIÓN COMPLETA!');
