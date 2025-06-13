// =====================================================
// SISTEMA DE NEWSLETTER Y CONTACTO - ASHLAR HOUSE
// =====================================================

// Configuración - usar variables del archivo de configuración
const config = window.NEWSLETTER_CONFIG || {};
const STRAPI_URL = config.STRAPI_URL || 'http://localhost:1337';
const MESSAGES = config.MESSAGES || {
    success: '✅ ¡Gracias! Tu mensaje ha sido enviado correctamente.',
    subscribed: '✅ ¡Bienvenido! Te has suscrito exitosamente al newsletter.',
    error: '❌ Hubo un error. Por favor, inténtalo de nuevo.',
    emailError: '❌ Error al enviar el email. Por favor, verifica tu conexión.',
    validationError: '⚠️ Por favor, completa todos los campos requeridos.'
};

// =====================================================
// INICIALIZACIÓN
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para formularios
    setupContactForm();
    setupFooterNewsletter();
});

// =====================================================
// FORMULARIO DE CONTACTO PRINCIPAL
// =====================================================
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter_email: formData.get('newsletter_email') === 'on',
            newsletter_whatsapp: formData.get('newsletter_whatsapp') === 'on'
        };
        
        try {
            // Mostrar loading
            showLoading(true);
            
            // 1. Enviar mensaje de contacto
            await sendContactMessage(data);
            
            // 2. Procesar suscripciones si están marcadas
            if (data.newsletter_email || data.newsletter_whatsapp) {
                await processNewsletterSubscription(data);
            }
            
            // Mostrar éxito
            showContactSuccess();
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            showContactError();
        } finally {
            showLoading(false);
        }
    });
}

// =====================================================
// NEWSLETTER DEL FOOTER
// =====================================================
function setupFooterNewsletter() {
    const form = document.getElementById('footer-newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('footer-newsletter-email').value;
        const whatsapp = document.getElementById('footer-whatsapp')?.checked || false;
        
        try {
            await processNewsletterSubscription({
                email: email,
                newsletter_email: true,
                newsletter_whatsapp: whatsapp
            });
            
            showFooterSuccess();
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al suscribirse. Por favor, intenta de nuevo.');
        }
    });
}

// =====================================================
// ENVÍO DE MENSAJE DE CONTACTO
// =====================================================
async function sendContactMessage(data) {
    // El envío de email ahora se maneja automáticamente en el backend
    // cuando se guarda el mensaje en Strapi
    await saveContactMessage(data);
}

async function saveContactMessage(data) {
    const response = await fetch(`${STRAPI_URL}/api/contact-messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                newsletter_email: data.newsletter_email || false,
                newsletter_whatsapp: data.newsletter_whatsapp || false
            }
        })
    });
    
    if (!response.ok) {
        throw new Error('Error al enviar mensaje');
    }
    
    return response.json();
}

// =====================================================
// GESTIÓN DE SUSCRIPCIONES
// =====================================================
async function processNewsletterSubscription(data) {
    // Verificar si ya existe el suscriptor
    const existingSubscriber = await checkExistingSubscriber(data.email);
    
    if (existingSubscriber) {
        // Actualizar suscriptor existente
        await updateSubscriber(existingSubscriber.id, data);
    } else {
        // Crear nuevo suscriptor
        await createSubscriber(data);
    }
}

async function checkExistingSubscriber(email) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/newsletter-subscribers?filters[email][$eq]=${email}`);
        const result = await response.json();
        
        return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch (error) {
        console.error('Error checking subscriber:', error);
        return null;
    }
}

async function createSubscriber(data) {
    const response = await fetch(`${STRAPI_URL}/api/newsletter-subscribers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                name: data.name || '',
                email: data.email,
                email_subscription: data.newsletter_email || false,
                whatsapp_subscription: data.newsletter_whatsapp || false,
                source: 'landing_page',
                status: 'active',
                subscribed_at: new Date().toISOString()
            }
        })
    });
    
    if (!response.ok) {
        throw new Error('Error al crear suscriptor');
    }
    
    // Enviar confirmación por WhatsApp si está activado
    if (data.newsletter_whatsapp && data.phone) {
        await sendWhatsAppWelcome(data.phone, data.name || 'Usuario');
    }
}

async function updateSubscriber(id, data) {
    const response = await fetch(`${STRAPI_URL}/api/newsletter-subscribers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                email_subscription: data.newsletter_email || false,
                whatsapp_subscription: data.newsletter_whatsapp || false,
                updated_at: new Date().toISOString()
            }
        })
    });
    
    if (!response.ok) {
        throw new Error('Error al actualizar suscriptor');
    }
}

// =====================================================
// NOTIFICACIÓN WHATSAPP DE BIENVENIDA
// =====================================================
async function sendWhatsAppWelcome(phone, name) {
    try {
        const message = `¡Hola ${name}! 🏡 Bienvenido/a al newsletter de Ashlar House. Recibirás nuestras mejores ofertas y promociones exclusivas por WhatsApp. ¡Gracias por suscribirte!`;
        
        // Usar el sistema WhatsApp existente de Strapi
        await fetch(`${STRAPI_URL}/api/whatsapp/send-welcome`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phone,
                message: message
            })
        });
    } catch (error) {
        console.error('Error sending WhatsApp welcome:', error);
        // No lanzar error para no interrumpir el flujo principal
    }
}

// =====================================================
// INTERFAZ DE USUARIO
// =====================================================
function showLoading(show) {
    const button = document.querySelector('#contact-form button[type="submit"]');
    if (!button) return;
    
    if (show) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Enviar mensaje';
    }
}

function showContactSuccess() {
    const successDiv = document.getElementById('contact-success');
    const errorDiv = document.getElementById('contact-error');
    
    if (successDiv) {
        successDiv.classList.remove('hidden');
        setTimeout(() => successDiv.classList.add('hidden'), 5000);
    }
    
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

function showContactError() {
    const successDiv = document.getElementById('contact-success');
    const errorDiv = document.getElementById('contact-error');
    
    if (errorDiv) {
        errorDiv.classList.remove('hidden');
        setTimeout(() => errorDiv.classList.add('hidden'), 5000);
    }
    
    if (successDiv) {
        successDiv.classList.add('hidden');
    }
}

function showFooterSuccess() {
    const successDiv = document.getElementById('footer-newsletter-success');
    if (successDiv) {
        successDiv.classList.remove('hidden');
        setTimeout(() => successDiv.classList.add('hidden'), 3000);
    }
}

// =====================================================
// UTILIDADES
// =====================================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Validar formato de teléfono mexicano
    const re = /^(\+52|52)?[\s\-]?(\d{2,3})[\s\-]?(\d{3,4})[\s\-]?(\d{4})$/;
    return re.test(phone);
}

// =====================================================
// EXPORTAR FUNCIONES (si usas módulos)
// =====================================================
window.NewsletterSystem = {
    sendContactMessage,
    processNewsletterSubscription,
    validateEmail,
    validatePhone
};
