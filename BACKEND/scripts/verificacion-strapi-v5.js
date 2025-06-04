// Verificación básica de Strapi v5 Lifecycle Hooks
console.log('🔍 VERIFICANDO STRAPI V5 LIFECYCLE HOOKS');
console.log('==========================================');

// Check if we can access environment variables
console.log('1. Environment variables check:');
require('dotenv').config({ path: '../.env' });
console.log('   CALLMEBOT_API_KEY_1:', process.env.CALLMEBOT_API_KEY_1 ? '✅ Configurada' : '❌ No encontrada');
console.log('   CALLMEBOT_API_KEY_2:', process.env.CALLMEBOT_API_KEY_2 ? '✅ Configurada' : '❌ No encontrada');

// Check the lifecycle file structure
console.log('\n2. Lifecycle file structure check:');
const fs = require('fs');
const path = require('path');

const lifecyclePath = path.join(__dirname, '../src/api/booking/content-types/booking/lifecycles.js');
console.log('   Lifecycle file path:', lifecyclePath);
console.log('   File exists:', fs.existsSync(lifecyclePath) ? '✅ Sí' : '❌ No');

if (fs.existsSync(lifecyclePath)) {
  try {
    const lifecycleContent = fs.readFileSync(lifecyclePath, 'utf8');
    console.log('   File size:', lifecycleContent.length, 'bytes');
    console.log('   Contains afterCreate:', lifecycleContent.includes('afterCreate') ? '✅ Sí' : '❌ No');
    console.log('   Contains sendWhatsAppNotification:', lifecycleContent.includes('sendWhatsAppNotification') ? '✅ Sí' : '❌ No');
  } catch (error) {
    console.log('   ❌ Error reading file:', error.message);
  }
}

// Check the schema file
console.log('\n3. Schema file check:');
const schemaPath = path.join(__dirname, '../src/api/booking/content-types/booking/schema.json');
console.log('   Schema file path:', schemaPath);
console.log('   File exists:', fs.existsSync(schemaPath) ? '✅ Sí' : '❌ No');

if (fs.existsSync(schemaPath)) {
  try {
    const schemaContent = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    console.log('   Collection name:', schemaContent.collectionName);
    console.log('   Has estado field:', schemaContent.attributes && schemaContent.attributes.estado ? '✅ Sí' : '❌ No');
    if (schemaContent.attributes && schemaContent.attributes.estado) {
      console.log('   Estado enum values:', schemaContent.attributes.estado.enum);
    }
  } catch (error) {
    console.log('   ❌ Error reading schema:', error.message);
  }
}

console.log('\n4. Strapi v5 Lifecycle Hook Requirements:');
console.log('   ✅ El archivo lifecycles.js debe estar en: src/api/[api-name]/content-types/[content-type]/lifecycles.js');
console.log('   ✅ Debe exportar un objeto con métodos del lifecycle (afterCreate, beforeCreate, etc.)');
console.log('   ✅ Strapi v5 debería cargar automáticamente estos archivos');

console.log('\n🔧 POSIBLES SOLUCIONES:');
console.log('==========================================');
console.log('1. Reiniciar Strapi completamente (npm run develop)');
console.log('2. Verificar que no haya errores de sintaxis en lifecycles.js');
console.log('3. Verificar logs de Strapi durante el arranque');
console.log('4. Probar con un console.log simple en afterCreate');
console.log('5. Verificar que el estado de la reserva sea exactamente "Reservado" o "Bloqueado"');

console.log('\n📝 PRÓXIMOS PASOS:');
console.log('==========================================');
console.log('1. Agregar console.log básico al inicio de afterCreate');
console.log('2. Reiniciar Strapi y crear una reserva de prueba');
console.log('3. Verificar si aparece el log en la consola de Strapi');
