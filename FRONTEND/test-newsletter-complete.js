// Test completo del sistema de newsletter
// Ejecutar: node test-newsletter-complete.js

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const FRONTEND_URL = 'http://localhost:8000';

async function testNewsletterSystem() {
    console.log('🧪 INICIANDO TEST COMPLETO DEL SISTEMA DE NEWSLETTER\n');
    
    const results = {
        strapi: false,
        frontend: false,
        newsletterAPI: false,
        contactAPI: false,
        whatsappAPI: false
    };
    
    // Test 1: Verificar Strapi
    console.log('1️⃣ Verificando Strapi...');
    try {
        const response = await axios.get(`${STRAPI_URL}/api/bookings`);
        if (response.status === 200) {
            console.log('✅ Strapi funcionando correctamente');
            results.strapi = true;
        }
    } catch (error) {
        console.log('❌ Strapi no responde:', error.message);
    }
    
    // Test 2: Verificar Frontend
    console.log('\n2️⃣ Verificando Frontend...');
    try {
        const response = await axios.get(`${FRONTEND_URL}/test-newsletter.html`);
        if (response.status === 200 && response.data.includes('Test Newsletter System')) {
            console.log('✅ Frontend funcionando correctamente');
            results.frontend = true;
        }
    } catch (error) {
        console.log('❌ Frontend no responde:', error.message);
    }
    
    // Test 3: Verificar API Newsletter Subscribers
    console.log('\n3️⃣ Verificando API Newsletter Subscribers...');
    try {
        const response = await axios.get(`${STRAPI_URL}/api/newsletter-subscribers`);
        console.log('✅ API Newsletter Subscribers funcionando');
        results.newsletterAPI = true;
    } catch (error) {
        console.log('❌ API Newsletter no responde:', error.response?.status, error.message);
    }
    
    // Test 4: Verificar API Contact Messages
    console.log('\n4️⃣ Verificando API Contact Messages...');
    try {
        const response = await axios.get(`${STRAPI_URL}/api/contact-messages`);
        console.log('✅ API Contact Messages funcionando');
        results.contactAPI = true;
    } catch (error) {
        console.log('❌ API Contact Messages no responde:', error.response?.status, error.message);
    }
    
    // Test 5: Verificar WhatsApp API
    console.log('\n5️⃣ Verificando WhatsApp API...');
    try {
        const testData = {
            phone: '+5211234567890',
            message: 'Test message from newsletter system'
        };
        
        const response = await axios.post(`${STRAPI_URL}/api/whatsapp/send-welcome`, testData);
        console.log('✅ WhatsApp API funcionando');
        results.whatsappAPI = true;
    } catch (error) {
        console.log('❌ WhatsApp API no responde:', error.response?.status, error.message);
    }
    
    // Test 6: Crear suscriptor de prueba
    console.log('\n6️⃣ Creando suscriptor de prueba...');
    try {
        const testSubscriber = {
            data: {
                name: 'Usuario de Prueba',
                email: `test-${Date.now()}@ejemplo.com`,
                email_subscription: true,
                whatsapp_subscription: true,
                source: 'landing_page',
                status: 'active'
            }
        };
        
        const response = await axios.post(`${STRAPI_URL}/api/newsletter-subscribers`, testSubscriber);
        if (response.status === 200 || response.status === 201) {
            console.log('✅ Suscriptor creado exitosamente');
            console.log('📧 Email:', testSubscriber.data.email);
        }
    } catch (error) {
        console.log('❌ Error creando suscriptor:', error.response?.status, error.message);
    }
    
    // Test 7: Crear mensaje de contacto de prueba
    console.log('\n7️⃣ Creando mensaje de contacto de prueba...');
    try {
        const testMessage = {
            data: {
                name: 'Usuario de Prueba',
                email: `contact-${Date.now()}@ejemplo.com`,
                subject: 'Test del sistema de newsletter',
                message: 'Este es un mensaje de prueba para verificar que el sistema funciona correctamente.',
                status: 'nuevo'
            }
        };
        
        const response = await axios.post(`${STRAPI_URL}/api/contact-messages`, testMessage);
        if (response.status === 200 || response.status === 201) {
            console.log('✅ Mensaje de contacto creado exitosamente');
        }
    } catch (error) {
        console.log('❌ Error creando mensaje:', error.response?.status, error.message);
    }
    
    // Resumen final
    console.log('\n📊 RESUMEN DEL TEST:');
    console.log('===================');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'FUNCIONANDO' : 'ERROR'}`);
    });
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
        console.log('\n📋 PRÓXIMOS PASOS:');
        console.log('1. Configura EmailJS siguiendo EMAILJS-SETUP.md');
        console.log('2. Actualiza las credenciales en js/newsletter-config.js');
        console.log('3. Prueba el formulario en la página principal');
        console.log('4. Verifica que los emails se envíen correctamente');
    } else {
        console.log('\n⚠️ ALGUNOS COMPONENTES NECESITAN ATENCIÓN');
        console.log('Revisa los errores anteriores y sigue las instrucciones de setup.');
    }
    
    console.log('\n🔗 ENLACES ÚTILES:');
    console.log(`Frontend: ${FRONTEND_URL}/Ashlar%20House.html`);
    console.log(`Test Page: ${FRONTEND_URL}/test-newsletter.html`);
    console.log(`Strapi Admin: ${STRAPI_URL}/admin`);
}

// Ejecutar el test
if (require.main === module) {
    testNewsletterSystem().catch(console.error);
}

module.exports = { testNewsletterSystem };
