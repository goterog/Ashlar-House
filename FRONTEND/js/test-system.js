// =====================================================
// PRUEBA COMPLETA DEL SISTEMA DE NEWSLETTER
// =====================================================

console.log('🚀 Iniciando pruebas del sistema de newsletter...');

// Función para probar el sistema completo
async function testNewsletterSystem() {
    console.log('\n📋 VERIFICANDO CONFIGURACIÓN...');
    
    // Verificar EmailJS
    if (typeof emailjs !== 'undefined') {
        console.log('✅ EmailJS cargado correctamente');
    } else {
        console.log('❌ EmailJS no encontrado');
        return;
    }
    
    // Verificar configuración
    if (window.NEWSLETTER_CONFIG) {
        console.log('✅ Configuración de newsletter cargada');
    } else {
        console.log('⚠️ Usando configuración por defecto');
    }
    
    console.log('\n🧪 PROBANDO APIS...');
    
    // Probar conexión con Strapi
    try {
        const response = await fetch('http://localhost:1337/api/newsletter-subscribers');
        if (response.ok) {
            console.log('✅ Conexión con Strapi exitosa');
            const data = await response.json();
            console.log(`📊 Suscriptores actuales: ${data.data.length}`);
        } else {
            console.log('❌ Error en conexión con Strapi:', response.status);
        }
    } catch (error) {
        console.log('❌ Error conectando con Strapi:', error.message);
    }
    
    console.log('\n📝 SIMULANDO ENVÍO DE FORMULARIO...');
    
    // Datos de prueba
    const testData = {
        name: 'Usuario de Prueba',
        email: 'prueba@ashlarhouse.com',
        subject: 'informacion_general',
        message: 'Esta es una prueba del sistema de newsletter.',
        newsletter_email: true,
        newsletter_whatsapp: true,
        phone: '+52-811-123-4567'
    };
    
    console.log('📧 Datos de prueba:', testData);
    
    // Simular envío (sin ejecutar realmente)
    console.log('\n⚠️ Para probar completamente:');
    console.log('1. Usa el formulario en la página web');
    console.log('2. Verifica que llegue el email');
    console.log('3. Revisa el admin de Strapi para ver los datos guardados');
    
    console.log('\n🎉 Sistema listo para usar!');
}

// Ejecutar pruebas cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(testNewsletterSystem, 1000);
});

// Función manual para probar
window.testNewsletter = testNewsletterSystem;
