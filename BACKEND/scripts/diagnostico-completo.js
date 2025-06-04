// Diagnóstico completo del sistema WhatsApp
console.log('🔍 DIAGNÓSTICO ASHLAR HOUSE - WhatsApp System');
console.log('==============================================');

require('dotenv').config();

console.log('📅 Fecha actual:', new Date().toLocaleString('es-MX'));
console.log('📂 Directorio:', process.cwd());

// 1. Verificar variables de entorno
console.log('\n1️⃣ VARIABLES DE ENTORNO:');
console.log(`   CALLMEBOT_API_KEY_1: ${process.env.CALLMEBOT_API_KEY_1 || 'NO CONFIGURADA'}`);
console.log(`   CALLMEBOT_API_KEY_2: ${process.env.CALLMEBOT_API_KEY_2 || 'NO CONFIGURADA'}`);

if (!process.env.CALLMEBOT_API_KEY_1) {
    console.log('❌ PROBLEMA: API Keys no están cargándose desde .env');
    console.log('Verificando archivo .env...');
    
    const fs = require('fs');
    if (fs.existsSync('.env')) {
        console.log('✅ Archivo .env existe');
        const envContent = fs.readFileSync('.env', 'utf8');
        const lines = envContent.split('\n').filter(line => line.includes('CALLMEBOT'));
        console.log('📄 Líneas de CallMeBot en .env:');
        lines.forEach(line => console.log(`   ${line}`));
    } else {
        console.log('❌ Archivo .env NO existe');
    }
} else {
    console.log('✅ API Keys configuradas correctamente');
}

// 2. Verificar archivo lifecycle
console.log('\n2️⃣ VERIFICAR LIFECYCLE HOOK:');
const lifecyclePath = 'src/api/booking/content-types/booking/lifecycles.js';
const fs = require('fs');

if (fs.existsSync(lifecyclePath)) {
    console.log('✅ Archivo lifecycle existe');
    
    try {
        // Mock strapi global para evitar errores
        global.strapi = {
            log: {
                info: (...args) => console.log('   📘 [INFO]', ...args),
                error: (...args) => console.log('   ❌ [ERROR]', ...args),
                warn: (...args) => console.log('   ⚠️ [WARN]', ...args)
            }
        };
        
        const lifecycle = require('./' + lifecyclePath);
        console.log('✅ Lifecycle carga sin errores');
        console.log('✅ Tiene afterCreate:', typeof lifecycle.afterCreate === 'function');
        
    } catch (error) {
        console.log('❌ Error cargando lifecycle:', error.message);
    }
} else {
    console.log('❌ Archivo lifecycle NO existe en:', lifecyclePath);
}

// 3. Test de conectividad básica
console.log('\n3️⃣ TEST DE CONECTIVIDAD:');

const https = require('https');

function testConnectivity() {
    return new Promise((resolve) => {
        console.log('   🌐 Probando conectividad con CallMeBot...');
        
        const req = https.get('https://api.callmebot.com/', (res) => {
            console.log(`   📊 Status: ${res.statusCode}`);
            console.log(`   ✅ Conectividad OK`);
            resolve(true);
        });
        
        req.on('error', (error) => {
            console.log(`   ❌ Error de conectividad: ${error.message}`);
            resolve(false);
        });
        
        req.setTimeout(10000, () => {
            console.log('   ⏰ Timeout de conectividad');
            req.destroy();
            resolve(false);
        });
    });
}

// 4. Test de API real
async function testWhatsAppAPI() {
    console.log('\n4️⃣ TEST DE API REAL:');
    
    if (!process.env.CALLMEBOT_API_KEY_1) {
        console.log('❌ No se puede probar API sin API key');
        return;
    }
    
    const phoneNumber = '+5218119936655';
    const apiKey = process.env.CALLMEBOT_API_KEY_1;
    const message = `🏠 Test diagnóstico Ashlar House - ${new Date().toLocaleTimeString('es-MX')}`;
    
    console.log(`   📞 Probando: ${phoneNumber}`);
    console.log(`   🔑 API Key: ${apiKey}`);
    console.log(`   💬 Mensaje: ${message}`);
    
    return new Promise((resolve) => {
        const encodedMessage = encodeURIComponent(message);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
        
        console.log(`   🔗 URL construida: ${url.substring(0, 100)}...`);
        
        const startTime = Date.now();
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const endTime = Date.now();
                console.log(`   ⏱️ Tiempo de respuesta: ${endTime - startTime}ms`);
                console.log(`   📊 Status Code: ${res.statusCode}`);
                console.log(`   📄 Response: "${data}"`);
                
                if (res.statusCode === 200) {
                    if (data.toLowerCase().includes('sent') || data.toLowerCase().includes('success')) {
                        console.log('   ✅ API respondió exitosamente');
                        console.log('   📱 Deberías recibir el mensaje en 1-3 minutos');
                    } else {
                        console.log('   ⚠️ API respondió pero con mensaje inesperado');
                    }
                } else {
                    console.log(`   ❌ Error HTTP: ${res.statusCode}`);
                }
                
                resolve(res.statusCode === 200);
            });
        });
        
        req.on('error', (error) => {
            console.log(`   ❌ Error de request: ${error.message}`);
            resolve(false);
        });
        
        req.setTimeout(15000, () => {
            console.log('   ⏰ Timeout de 15 segundos');
            req.destroy();
            resolve(false);
        });
    });
}

// Ejecutar diagnóstico completo
async function runDiagnosis() {
    const connectivityOK = await testConnectivity();
    
    if (connectivityOK) {
        await testWhatsAppAPI();
    }
    
    console.log('\n📋 RESUMEN Y RECOMENDACIONES:');
    console.log('==============================================');
    
    if (!process.env.CALLMEBOT_API_KEY_1) {
        console.log('❌ PROBLEMA PRINCIPAL: API Keys no se cargan');
        console.log('   🔧 Solución: Verificar archivo .env');
        console.log('   📍 Archivo debe estar en:', process.cwd() + '\\.env');
    } else if (!connectivityOK) {
        console.log('❌ PROBLEMA PRINCIPAL: Sin conectividad a CallMeBot');
        console.log('   🔧 Solución: Verificar conexión a internet');
    } else {
        console.log('✅ Configuración parece correcta');
        console.log('📍 Posibles causas si no llegan mensajes:');
        console.log('   1. Número no registrado en CallMeBot');
        console.log('   2. API key incorrecta o expirada');
        console.log('   3. Lifecycle hook no se ejecuta en Strapi');
        console.log('   4. Mensajes bloqueados por WhatsApp');
    }
    
    console.log('\n🔍 Para debug adicional:');
    console.log('   - Revisa logs de Strapi en la consola');
    console.log('   - Verifica que la reserva tenga estado "Reservado" o "Bloqueado"');
    console.log('   - Confirma que veas logs como "Enviando WhatsApp a..."');
    
    console.log('\n==============================================');
}

runDiagnosis().catch(error => {
    console.error('\n💥 ERROR EN DIAGNÓSTICO:', error.message);
});
