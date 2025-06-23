#!/usr/bin/env node

/**
 * SCRIPT COMPLETO DE WHATSAPP - ASHLAR HOUSE
 * Unifica todas las funciones: Demo, Test, Diagnóstico y Simulación
 * 
 * Comandos disponibles:
 * - node whatsapp-test-complete.js demo       (Demostración sin envío real)
 * - node whatsapp-test-complete.js test       (Test real de API)
 * - node whatsapp-test-complete.js diagnostic (Diagnóstico completo)
 * - node whatsapp-test-complete.js simulate   (Simulación del lifecycle)
 * - node whatsapp-test-complete.js help       (Ver ayuda) */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const https = require('https');
const fs = require('fs');

// Configuración
const STRAPI_URL = 'http://localhost:1337';
const PHONE_CONFIGS = [
    { 
        name: 'Primer número', 
        phone: '+5218119936655', 
        cleanPhone: '5218119936655',
        apiKey: process.env.CALLMEBOT_API_KEY_1 || '4639929'
    },
    { 
        name: 'Segundo número', 
        phone: '+5218111755533', 
        cleanPhone: '5218111755533',
        apiKey: process.env.CALLMEBOT_API_KEY_2 || '1855584'
    }
];

// Mock del objeto strapi para simulaciones
const mockStrapi = {
    log: {
        info: (msg) => console.log(`ℹ️  [INFO] ${msg}`),
        error: (msg, error) => console.log(`❌ [ERROR] ${msg}`, error || ''),
        warn: (msg) => console.log(`⚠️  [WARN] ${msg}`)
    }
};

// Utilidades
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
}

function showHeader(title) {
    console.log('\n🏠 ASHLAR HOUSE - ' + title);
    console.log('='.repeat(50 + title.length));
    console.log(`📅 Fecha: ${new Date().toLocaleString('es-MX')}`);
    console.log(`📂 Directorio: ${process.cwd()}\n`);
}

// =============================================================================
// FUNCIÓN PRINCIPAL DE ENVÍO WHATSAPP
// =============================================================================
async function sendWhatsAppMessage(phoneNumber, message, apiKey, isRealSend = true) {
    return new Promise((resolve, reject) => {
        try {
            const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
            
            if (!apiKey || apiKey === 'PENDIENTE_SEGUNDO_NUMERO') {
                mockStrapi.log.warn(`API key no configurada para ${phoneNumber} - no se enviará notificación WhatsApp`);
                resolve({ success: false, reason: 'No API key' });
                return;
            }
            
            const encodedMessage = encodeURIComponent(message);
            const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
            
            if (!isRealSend) {
                // Modo demo - solo mostrar el mensaje
                console.log(`📱 WhatsApp → ${phoneNumber}`);
                console.log('━'.repeat(50));
                console.log(message);
                console.log('━'.repeat(50));
                setTimeout(() => {
                    console.log(`✅ [DEMO] Mensaje simulado para ${phoneNumber}\n`);
                    resolve({ success: true, demo: true });
                }, 500);
                return;
            }
            
            mockStrapi.log.info(`Enviando WhatsApp a ${phoneNumber}: ${message.substring(0, 50)}...`);
            
            const startTime = Date.now();
            const req = https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    const endTime = Date.now();
                    console.log(`⏱️  Tiempo de respuesta: ${endTime - startTime}ms`);
                    console.log(`📊 Status Code: ${res.statusCode}`);
                    console.log(`📄 Response: "${data}"`);
                    
                    if (res.statusCode === 200) {
                        if (data.toLowerCase().includes('sent') || data.toLowerCase().includes('success')) {
                            mockStrapi.log.info(`WhatsApp enviado exitosamente a ${phoneNumber}`);
                            resolve({ success: true, response: data });
                        } else {
                            mockStrapi.log.warn(`Respuesta inesperada para ${phoneNumber}: ${data}`);
                            resolve({ success: false, response: data });
                        }
                    } else {
                        const error = new Error(`Error ${res.statusCode}: ${data}`);
                        mockStrapi.log.error(`Error enviando WhatsApp a ${phoneNumber}:`, error.message);
                        reject(error);
                    }
                });
            });
            
            req.on('error', (error) => {
                mockStrapi.log.error(`Error enviando WhatsApp a ${phoneNumber}:`, error.message);
                reject(error);
            });
            
            req.setTimeout(15000, () => {
                req.destroy();
                const error = new Error('Timeout sending WhatsApp message');
                mockStrapi.log.error(`Timeout enviando WhatsApp a ${phoneNumber}`);
                reject(error);
            });
            
        } catch (error) {
            mockStrapi.log.error(`Error general enviando WhatsApp a ${phoneNumber}:`, error.message);
            reject(error);
        }
    });
}

// =============================================================================
// FUNCIÓN DE NOTIFICACIÓN PRINCIPAL (del lifecycle)
// =============================================================================
async function sendWhatsAppNotification(booking, isRealSend = true) {
    try {
        const startDate = new Date(booking.start);
        const endDate = new Date(booking.end);
        const isSingleDay = startDate.toDateString() === endDate.toDateString();
        
        let message = '';
        
        if (booking.estado === 'Bloqueado') {
            message = isSingleDay 
                ? `Se ha ${booking.estado.toLowerCase()} el día ${formatDate(booking.start)} desde ${booking.source || 'Otra'}`
                : `Se han ${booking.estado.toLowerCase()} los días ${formatDate(booking.start)} al ${formatDate(booking.end)} desde ${booking.source || 'Otra'}`;
        } else if (booking.estado === 'Reservado') {
            message = isSingleDay 
                ? `Se ha ${booking.estado.toLowerCase()} el día ${formatDate(booking.start)} desde ${booking.source || 'Otra'}`
                : `Se han ${booking.estado.toLowerCase()} los días ${formatDate(booking.start)} al ${formatDate(booking.end)} desde ${booking.source || 'Otra'}`;
            
            // Añadir datos del cliente si existen
            const clientData = [];
            if (booking.name) clientData.push(`Nombre: ${booking.name}`);
            if (booking.guest) clientData.push(`Número de huéspedes: ${booking.guest}`);
            if (booking.phone) clientData.push(`Teléfono: ${booking.phone}`);
            if (booking.email) clientData.push(`E-mail: ${booking.email}`);
            if (booking.message) clientData.push(`Mensaje del huésped: ${booking.message}`);
            
            if (clientData.length > 0) {
                message += '\n\nCon los siguientes datos de reservación:\n' + clientData.join('\n');
            }
        }
        
        const promises = PHONE_CONFIGS.map(config => 
            sendWhatsAppMessage(config.phone, message, config.apiKey, isRealSend)
        );
        
        await Promise.allSettled(promises);
        mockStrapi.log.info(`Notificaciones WhatsApp procesadas para reserva ID: ${booking.id}`);
        
    } catch (error) {
        mockStrapi.log.error('Error en sendWhatsAppNotification:', error);
        throw error;
    }
}

// =============================================================================
// MODO DEMO - Simulación sin envío real
// =============================================================================
async function runDemo() {
    showHeader('DEMO DEL SISTEMA DE NOTIFICACIONES');
    
    console.log('⚙️  CONFIGURACIÓN:');
    console.log(`   API Key 1: ${process.env.CALLMEBOT_API_KEY_1 ? '✅ ' + process.env.CALLMEBOT_API_KEY_1 : '❌ No configurada'}`);
    console.log(`   API Key 2: ${process.env.CALLMEBOT_API_KEY_2 ? '✅ ' + process.env.CALLMEBOT_API_KEY_2 : '❌ No configurada'}`);
    console.log(`   Números destino: ${PHONE_CONFIGS.map(c => c.phone).join(', ')}\n`);
    
    if (!process.env.CALLMEBOT_API_KEY_1) {
        console.log('📋 NOTA: Para activar las notificaciones reales:');
        console.log('   1. Envía "I allow callmebot to send me messages" al +34 613 00 20 27');
        console.log('   2. Actualiza las API keys en el archivo .env');
        console.log('   3. Reinicia el servidor Strapi\n');
    }
    
    const demoBookings = [
        {
            id: 1,
            title: "Bloqueo fin de semana",
            start: "2025-06-14",
            end: "2025-06-15",
            estado: "Bloqueado",
            source: "Landing page"
        },
        {
            id: 2,
            title: "Reserva familiar",
            start: "2025-06-20",
            end: "2025-06-20",
            estado: "Reservado",
            source: "Airbnb",
            name: "María González",
            guest: "4",
            phone: "+52-811-987-6543",
            email: "maria@example.com",
            message: "Celebración de aniversario"
        },
        {
            id: 3,
            title: "Reserva semana completa",
            start: "2025-07-01",
            end: "2025-07-07",
            estado: "Reservado",
            source: "Landing page",
            name: "Carlos Ramírez",
            guest: "6",
            phone: "+52-811-123-4567",
            email: "carlos.ramirez@email.com"
        }
    ];
    
    for (let i = 0; i < demoBookings.length; i++) {
        const booking = demoBookings[i];
        console.log(`📝 DEMO ${i + 1}/3: ${booking.title}`);
        console.log('─'.repeat(60));
        
        console.log(`🔔 Procesando notificación para reserva ID: ${booking.id}`);
        console.log(`   Estado: ${booking.estado}`);
        console.log(`   Fechas: ${booking.start} → ${booking.end}`);
        console.log(`   Origen: ${booking.source}\n`);
        
        await sendWhatsAppNotification(booking, false); // Modo demo
        
        if (i < demoBookings.length - 1) {
            console.log('⏱️  Esperando 2 segundos...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('✨ DEMO COMPLETADO');
    console.log('📖 Para más información consulta: WHATSAPP-SETUP.md');
    console.log('🚀 Para implementar en producción: IMPLEMENTACION-WHATSAPP.md');
}

// =============================================================================
// MODO TEST - Test real de API
// =============================================================================
async function runTest() {
    showHeader('TEST REAL DE API WHATSAPP');
    
    console.log('📋 CONFIGURACIÓN:');
    PHONE_CONFIGS.forEach((config, index) => {
        console.log(`   ${index + 1}. ${config.name}: ${config.phone}`);
        console.log(`      API Key: ${config.apiKey ? '✅ ' + config.apiKey : '❌ No configurada'}`);
    });
    console.log();
    
    const testMessage = `🧪 TEST SISTEMA ASHLAR HOUSE
📅 ${new Date().toLocaleDateString('es-MX')}
⏰ ${new Date().toLocaleTimeString('es-MX')}
🔧 Estado: Test del sistema de notificaciones
✅ Sistema funcionando correctamente!`;
    
    console.log('💬 Mensaje de prueba:');
    console.log(testMessage);
    console.log('\n' + '='.repeat(50));
    
    for (const config of PHONE_CONFIGS) {
        try {
            console.log(`\n📞 Probando ${config.name}: ${config.phone}`);
            
            if (!config.apiKey || config.apiKey === 'PENDIENTE_SEGUNDO_NUMERO') {
                console.log(`❌ API key no configurada para ${config.name}`);
                continue;
            }
            
            const result = await sendWhatsAppMessage(config.phone, testMessage, config.apiKey, true);
            
            if (result.success) {
                console.log(`🎉 ¡${config.name} OK! Mensaje enviado exitosamente`);
            } else {
                console.log(`⚠️  Problema con ${config.name}`);
            }
            
            // Esperar entre envíos para evitar rate limiting
            if (config !== PHONE_CONFIGS[PHONE_CONFIGS.length - 1]) {
                console.log('⏳ Esperando 3 segundos...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            
        } catch (error) {
            console.log(`❌ Error con ${config.name}: ${error.message}`);
        }
    }
    
    console.log('\n🏁 TEST COMPLETADO');
    console.log('📱 Revisa WhatsApp en los próximos 1-3 minutos');
    console.log('='.repeat(50));
}

// =============================================================================
// MODO DIAGNÓSTICO - Diagnóstico completo del sistema
// =============================================================================
async function runDiagnostic() {
    showHeader('DIAGNÓSTICO COMPLETO DEL SISTEMA');
    
    // 1. Verificar variables de entorno
    console.log('1️⃣ VARIABLES DE ENTORNO:');
    console.log(`   CALLMEBOT_API_KEY_1: ${process.env.CALLMEBOT_API_KEY_1 || 'NO CONFIGURADA'}`);
    console.log(`   CALLMEBOT_API_KEY_2: ${process.env.CALLMEBOT_API_KEY_2 || 'NO CONFIGURADA'}`);
    
    if (!process.env.CALLMEBOT_API_KEY_1) {
        console.log('❌ PROBLEMA: API Keys no están cargándose desde .env');
        console.log('Verificando archivo .env...');
        
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
    
    if (fs.existsSync(lifecyclePath)) {
        console.log('✅ Archivo lifecycle existe');
        
        try {
            global.strapi = mockStrapi;
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
    const connectivityOK = await testConnectivity();
    
    // 4. Test de API real (si hay conectividad)
    if (connectivityOK && process.env.CALLMEBOT_API_KEY_1) {
        console.log('\n4️⃣ TEST DE API REAL:');
        await testWhatsAppAPI();
    }
    
    // 5. Resumen y recomendaciones
    console.log('\n📋 RESUMEN Y RECOMENDACIONES:');
    console.log('='.repeat(50));
    
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
}

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

async function testWhatsAppAPI() {
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

// =============================================================================
// MODO SIMULACIÓN - Simula el lifecycle completo
// =============================================================================
async function runSimulate() {
    showHeader('SIMULACIÓN COMPLETA DEL LIFECYCLE');
    
    console.log('📋 CONFIGURACIÓN:');
    console.log(`API Key 1: ${process.env.CALLMEBOT_API_KEY_1 ? '✅ ' + process.env.CALLMEBOT_API_KEY_1 : '❌ No configurada'}`);
    console.log(`API Key 2: ${process.env.CALLMEBOT_API_KEY_2 ? '✅ ' + process.env.CALLMEBOT_API_KEY_2 : '❌ No configurada'}`);
    console.log();
    
    // Simulación del lifecycle hook
    async function simulateBookingCreation(bookingData) {
        const event = { result: bookingData };
        
        try {
            if (bookingData.estado === 'Bloqueado' || bookingData.estado === 'Reservado') {
                await sendWhatsAppNotification(bookingData, true); // Envío real
            }
        } catch (error) {
            mockStrapi.log.error('Error al enviar notificación WhatsApp:', error);
        }
    }
    
    // Test 1: Reserva de un solo día
    console.log('📝 TEST 1: Reserva de un solo día');
    console.log('='.repeat(40));
    
    const singleDayBooking = {
        id: 1,
        estado: 'Reservado',
        start: '2025-06-04',
        end: '2025-06-04',
        source: 'Airbnb',
        name: 'Juan Ejemplo',
        guest: '2',
        phone: '+52-81-1234-5678',
        email: 'ejemplo@email.com',
        message: 'Esto es una prueba de reserva de un solo día'
    };
    
    await simulateBookingCreation(singleDayBooking);
    
    console.log('\n⏳ Esperando 5 segundos antes del siguiente test...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test 2: Bloqueo de múltiples días
    console.log('📝 TEST 2: Bloqueo de múltiples días');
    console.log('='.repeat(40));
    
    const multiDayBlocking = {
        id: 2,
        estado: 'Bloqueado',
        start: '2025-06-10',
        end: '2025-06-15',
        source: 'Landing page'
    };
    
    await simulateBookingCreation(multiDayBlocking);
    
    console.log('\n🏁 SIMULACIÓN COMPLETADA');
    console.log('========================');
    console.log('📱 Revisa WhatsApp en los próximos 1-3 minutos');
    console.log('✅ Si recibes los mensajes, el sistema está funcionando correctamente');
    console.log('🎉 ¡Ashlar House está listo para recibir notificaciones automáticas!');
}

// =============================================================================
// VERIFICACIÓN DE STRAPI (para test completo)
// =============================================================================
async function checkStrapiStatus() {
    try {
        const response = await fetch(`${STRAPI_URL}/api/bookings`);
        if (response.ok) {
            console.log('✅ Strapi está ejecutándose correctamente');
            return true;
        } else {
            console.log('❌ Strapi responde pero hay errores:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Strapi no está ejecutándose:', error.message);
        return false;
    }
}

// =============================================================================
// FUNCIÓN DE AYUDA
// =============================================================================
function showHelp() {
    console.log('🏠 ASHLAR HOUSE - Script Completo de WhatsApp');
    console.log('='.repeat(50));
    console.log('\n📋 COMANDOS DISPONIBLES:');
    console.log('   demo       - Demostración sin envío real de mensajes');
    console.log('   test       - Test real de la API de WhatsApp');
    console.log('   diagnostic - Diagnóstico completo del sistema');
    console.log('   simulate   - Simulación completa del lifecycle');
    console.log('   help       - Mostrar esta ayuda');
    console.log('\n📝 EJEMPLOS DE USO:');
    console.log('   node whatsapp-test-complete.js demo');
    console.log('   node whatsapp-test-complete.js test');
    console.log('   node whatsapp-test-complete.js diagnostic');
    console.log('   node whatsapp-test-complete.js simulate');
    console.log('\n📖 DESCRIPCIÓN:');
    console.log('   • demo      - Muestra cómo serían los mensajes sin enviarlos');
    console.log('   • test      - Envía mensajes reales de prueba');
    console.log('   • diagnostic- Verifica configuración y conectividad');
    console.log('   • simulate  - Simula el proceso completo de lifecycle hooks');
    console.log('\n🔧 CONFIGURACIÓN REQUERIDA:');
    console.log('   - Variables CALLMEBOT_API_KEY_1 y CALLMEBOT_API_KEY_2 en .env');
    console.log('   - Números registrados en CallMeBot (+34 613 00 20 27)');
    console.log('   - Strapi ejecutándose (solo para algunos tests)');
}

// =============================================================================
// FUNCIÓN PRINCIPAL
// =============================================================================
async function main() {
    const command = process.argv[2] || 'help';
    
    switch (command.toLowerCase()) {
        case 'demo':
            await runDemo();
            break;
        case 'test':
            await runTest();
            break;
        case 'diagnostic':
        case 'diagnose':
            await runDiagnostic();
            break;
        case 'simulate':
        case 'sim':
            await runSimulate();
            break;
        case 'help':
        case '--help':
        case '-h':
        default:
            showHelp();
            break;
    }
}

// Ejecutar script
main().catch(error => {
    console.error('\n💥 ERROR FATAL:', error.message);
    if (error.stack) {
        console.error('📚 Stack:', error.stack);
    }
    process.exit(1);
});
