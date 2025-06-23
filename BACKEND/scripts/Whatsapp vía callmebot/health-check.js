#!/usr/bin/env node

/**
 * HEALTH CHECK - ASHLAR HOUSE
 * Verificación rápida y básica del sistema WhatsApp
 * Para diagnósticos completos usar: whatsapp-test-complete.js diagnostic */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Configuración
const STRAPI_URL = 'http://localhost:1337';
const PHONE_CONFIGS = [
    { name: 'Primer número', phone: '+5218119936655', apiKey: process.env.CALLMEBOT_API_KEY_1 || '4639929' },
    { name: 'Segundo número', phone: '+5218111755533', apiKey: process.env.CALLMEBOT_API_KEY_2 || '1855584' }
];

console.log('🔍 HEALTH CHECK - Sistema WhatsApp Ashlar House');
console.log('='.repeat(50));
console.log(`📅 ${new Date().toLocaleString('es-MX')}\n`);

// Verificaciones básicas
async function verificarVariablesEntorno() {
    console.log('1️⃣ VARIABLES DE ENTORNO:');
    let allPresent = true;
    
    PHONE_CONFIGS.forEach(config => {
        const hasKey = config.apiKey && config.apiKey !== 'PENDIENTE_SEGUNDO_NUMERO';
        console.log(`   ${config.name}: ${hasKey ? '✅ Configurada' : '❌ No configurada'}`);
        if (!hasKey) allPresent = false;
    });
    
    return allPresent;
}

async function verificarStrapi() {
    console.log('\n2️⃣ STRAPI:');
    try {
        const response = await fetch(`${STRAPI_URL}/api/bookings`);
        if (response.ok) {
            console.log('   ✅ Ejecutándose correctamente');
            return true;
        } else {
            console.log(`   ⚠️  Responde con errores: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log('   ❌ No está ejecutándose');
        return false;
    }
}

async function verificarWhatsAppBasico() {
    console.log('\n3️⃣ WHATSAPP API (Test básico):');
    const config = PHONE_CONFIGS[0]; // Solo primer número para health check
    
    if (!config.apiKey || config.apiKey === 'PENDIENTE_SEGUNDO_NUMERO') {
        console.log('   ❌ API Key no configurada');
        return false;
    }
    
    try {
        const testMessage = '🔍 Health check - Ashlar House';
        const cleanPhone = config.phone.replace(/[-\s+]/g, '');
        const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(testMessage)}&apikey=${config.apiKey}`;
        
        const response = await fetch(url);
        
        if (response.ok) {
            console.log('   ✅ API responde correctamente');
            return true;
        } else {
            console.log(`   ❌ Error en API: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Error de conectividad: ${error.message}`);
        return false;
    }
}

async function main() {
    const envOk = await verificarVariablesEntorno();
    const strapiOk = await verificarStrapi();
    const whatsappOk = await verificarWhatsAppBasico();
    
    console.log('\n📊 RESUMEN:');
    console.log('='.repeat(30));
    console.log(`Variables de entorno: ${envOk ? '✅' : '❌'}`);
    console.log(`Strapi: ${strapiOk ? '✅' : '❌'}`);
    console.log(`WhatsApp API: ${whatsappOk ? '✅' : '❌'}`);
    
    const allOk = envOk && strapiOk && whatsappOk;
    
    console.log(`\n${allOk ? '🎉' : '⚠️'} Estado general: ${allOk ? 'SISTEMA OK' : 'REQUIERE ATENCIÓN'}`);
    
    if (!allOk) {
        console.log('\n🔧 RECOMENDACIONES:');
        if (!envOk) console.log('   • Configurar API keys en archivo .env');
        if (!strapiOk) console.log('   • Iniciar Strapi: npm run develop');
        if (!whatsappOk) console.log('   • Verificar registro en CallMeBot');
        console.log('\n📖 Para diagnóstico completo ejecuta:');
        console.log('   node whatsapp-test-complete.js diagnostic');
    } else {
        console.log('\n👍 El sistema está listo para uso en producción');
        console.log('\n🔧 HERRAMIENTAS ADICIONALES:');
        console.log('   • Demo: node whatsapp-test-complete.js demo');
        console.log('   • Test: node whatsapp-test-complete.js test');
        console.log('   • Diagnóstico: node whatsapp-test-complete.js diagnostic');
    }
}

main().catch(console.error);
