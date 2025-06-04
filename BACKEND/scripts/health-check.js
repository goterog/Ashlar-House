#!/usr/bin/env node

/**
 * Script de Verificación Rápida - Ashlar House
 * Verifica que todos los componentes estén funcionando correctamente
 */

const https = require('https');

// Configuración
const STRAPI_URL = 'http://localhost:1337';
const API_KEYS = {
    '+5218119936655': process.env.CALLMEBOT_API_KEY_1 || '4639929',
    '+5218111755533': process.env.CALLMEBOT_API_KEY_2 || '1855584'
};

console.log('🔍 Verificación Rápida del Sistema Ashlar House\n');

async function verificarStrapi() {
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

async function verificarWhatsApp() {
    const testNumber = '+5218119936655';
    const apiKey = API_KEYS[testNumber];
    const testMessage = '🧪 Test de conectividad WhatsApp - Ashlar House';
    
    try {
        const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(testNumber)}&text=${encodeURIComponent(testMessage)}&apikey=${apiKey}`;
        const response = await fetch(url);
        
        if (response.ok) {
            console.log('✅ API de WhatsApp está funcionando');
            return true;
        } else {
            console.log('❌ Error en API de WhatsApp:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Error de conectividad WhatsApp:', error.message);
        return false;
    }
}

async function verificarVariablesEntorno() {
    const requiredVars = ['CALLMEBOT_API_KEY_1', 'CALLMEBOT_API_KEY_2'];
    let allPresent = true;
    
    for (const varName of requiredVars) {
        if (process.env[varName]) {
            console.log(`✅ ${varName} configurada`);
        } else {
            console.log(`❌ ${varName} no encontrada`);
            allPresent = false;
        }
    }
    
    return allPresent;
}

async function main() {
    console.log('📋 Verificando variables de entorno...');
    const envOk = await verificarVariablesEntorno();
    
    console.log('\n🌐 Verificando conectividad Strapi...');
    const strapiOk = await verificarStrapi();
    
    console.log('\n📱 Verificando API de WhatsApp...');
    const whatsappOk = await verificarWhatsApp();
    
    console.log('\n📊 Resumen:');
    console.log(`Variables de entorno: ${envOk ? '✅' : '❌'}`);
    console.log(`Strapi: ${strapiOk ? '✅' : '❌'}`);
    console.log(`WhatsApp API: ${whatsappOk ? '✅' : '❌'}`);
    
    if (envOk && strapiOk && whatsappOk) {
        console.log('\n🎉 ¡Todo está funcionando correctamente!');
        console.log('👍 El sistema está listo para producción.');
    } else {
        console.log('\n⚠️  Hay problemas que resolver antes de continuar.');
        console.log('📖 Consulta DEVELOPMENT.md para troubleshooting.');
    }
}

main().catch(console.error);
