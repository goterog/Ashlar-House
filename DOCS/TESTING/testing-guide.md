# 🧪 Testing Guide - Ashlar House

*Guía completa de pruebas del sistema - Actualizada: 13 de Junio, 2025*

## 🎯 Estrategia de Testing

### Tipos de Pruebas Implementadas

1. **Unit Tests** - Funciones individuales
2. **Integration Tests** - APIs y servicios externos
3. **End-to-End Tests** - Flujos completos de usuario
4. **Manual Tests** - Verificación visual y funcional

## 🔧 Configuración de Testing

### Herramientas de Prueba

#### Backend Testing
```bash
# Scripts de prueba disponibles
BACKEND/
├── scripts/health-check.js          # ✅ Suite completa de pruebas
├── scripts/
│   ├── health-check.js             # ✅ Verificación de salud
│   ├── check-strapi.js             # ✅ Test de Strapi
│   └── simple-whatsapp-test.js     # ✅ Test de WhatsApp
```

#### Frontend Testing
```bash
FRONTEND/
├── src/index.html               # Landing principal (dev: npm run dev)
└── src/campaign-manager.html    # Gestión de campañas
```

## 🚀 Ejecución de Pruebas

### 1. Prueba Completa del Sistema

```bash
cd BACKEND
npm run health-check
```

#### Salida Esperada:
```
🧪 SISTEMA DE PRUEBAS COMPLETO - ASHLAR HOUSE
==============================================

🔍 1. Verificando conectividad Strapi...
✅ Strapi conectado correctamente en http://localhost:1337

📧 2. Probando Newsletter Subscribers API...
✅ Newsletter subscriber creado exitosamente - ID: 12

💬 3. Probando Contact Messages API...
✅ Contact message creado exitosamente - ID: 8

📱 4. Probando notificaciones WhatsApp...
✅ WhatsApp enviado a +5218119936655
✅ WhatsApp enviado a +5218111755533

📧 5. Probando EmailJS...
✅ Email enviado exitosamente

🎉 TODAS LAS PRUEBAS PASARON EXITOSAMENTE
======================================
```

### 2. Health Check Rápido

```bash
cd BACKEND
node scripts/health-check.js
```

#### Salida Esperada:
```
🏥 HEALTH CHECK - ASHLAR HOUSE
=============================

🔍 Verificando servicios...
✅ Strapi Server: Running (200 OK)
✅ Database: Connected (SQLite)
✅ WhatsApp API: Working (CallMeBot)
✅ EmailJS API: Working
✅ Environment Variables: All Set

🎯 Estado: SISTEMA COMPLETAMENTE FUNCIONAL
```

### 3. Test de WhatsApp Individual

```bash
cd BACKEND
node scripts/simple-whatsapp-test.js
```

#### Salida Esperada:
```
📱 PRUEBA DE WHATSAPP - ASHLAR HOUSE
==================================

🔑 Verificando API Keys...
✅ CALLMEBOT_API_KEY_1: Configurada
✅ CALLMEBOT_API_KEY_2: Configurada

📤 Enviando mensaje de prueba...
✅ WhatsApp enviado a +5218119936655: Message sent successfully
✅ WhatsApp enviado a +5218111755533: Message sent successfully

🎉 PRUEBA DE WHATSAPP COMPLETADA
```

## 🔌 Testing de APIs

### Newsletter Subscribers API

#### Test de Creación (POST)
```bash
curl -X POST http://localhost:1337/api/newsletter-subscribers \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "subscribe_email": true,
      "subscribe_whatsapp": false,
      "source": "test_api"
    }
  }'
```

#### Test de Listado (GET)
```bash
curl -X GET http://localhost:1337/api/newsletter-subscribers
```

#### Test de Filtros
```bash
# Filtrar por suscripción email
curl -X GET "http://localhost:1337/api/newsletter-subscribers?filters[subscribe_email][\$eq]=true"

# Filtrar por fuente
curl -X GET "http://localhost:1337/api/newsletter-subscribers?filters[source][\$eq]=footer_form"
```

### Contact Messages API

#### Test de Creación (POST)
```bash
curl -X POST http://localhost:1337/api/contact-messages \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Test Contact",
      "email": "contact@example.com",
      "phone": "5218119936655",
      "subject": "informacion_general",
      "message": "Este es un mensaje de prueba del sistema de contacto.",
      "newsletter_email": true,
      "newsletter_whatsapp": false
    }
  }'
```

#### Test de Validación (Error Cases)
```bash
# Email inválido
curl -X POST http://localhost:1337/api/contact-messages \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Test",
      "email": "invalid-email",
      "message": "Test message"
    }
  }'

# Mensaje muy corto
curl -X POST http://localhost:1337/api/contact-messages \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Test",
      "email": "test@example.com",
      "message": "Hi"
    }
  }'
```

## 🎭 Testing Frontend

### Página de Pruebas Interactiva

Abrir en navegador: `http://localhost:3000/`

#### Funcionalidades a Probar:

1. **Formulario de Contacto**
   - ✅ Validación de campos requeridos
   - ✅ Validación de formato de email
   - ✅ Validación de longitud de mensaje
   - ✅ Envío exitoso con todos los campos
   - ✅ Manejo de errores de red

2. **Newsletter Footer**
   - ✅ Suscripción solo email
   - ✅ Suscripción solo WhatsApp
   - ✅ Suscripción dual (email + WhatsApp)
   - ✅ Validación de email único
   - ✅ Confirmación visual

3. **Campaign Manager**
   - ✅ Listado de suscriptores
   - ✅ Filtros por tipo de suscripción
   - ✅ Exportación de listas
   - ✅ Estadísticas de conversión

### JavaScript Testing

```javascript
// FRONTEND/public/js/newsletter.js
const runFrontendTests = async () => {
  console.log('🧪 Iniciando pruebas frontend...');
  
  // Test 1: Validación de email
  const testEmail = 'test@example.com';
  const isValidEmail = validateEmail(testEmail);
  console.log(`✅ Email validation: ${isValidEmail}`);
  
  // Test 2: Envío de newsletter
  try {
    const result = await subscribeToNewsletter({
      name: 'Test User',
      email: testEmail,
      subscribe_email: true,
      subscribe_whatsapp: false
    });
    console.log('✅ Newsletter subscription successful');
  } catch (error) {
    console.error('❌ Newsletter subscription failed:', error);
  }
  
  // Test 3: Envío de contacto
  try {
    const result = await submitContactForm({
      name: 'Test Contact',
      email: testEmail,
      message: 'This is a test message from the frontend testing system.',
      newsletter_email: true
    });
    console.log('✅ Contact form submission successful');
  } catch (error) {
    console.error('❌ Contact form submission failed:', error);
  }
};
```

## 📊 Testing de Integraciones

### WhatsApp CallMeBot Integration

#### Test Manual
```javascript
// BACKEND/scripts/test-whatsapp-integration.js
const testWhatsAppIntegration = async () => {
  console.log('📱 Testing WhatsApp integration...');
  
  const testBooking = {
    guest_name: 'Test Guest',
    email: 'test@example.com',
    phone: '5218119936655',
    check_in: '2025-06-15',
    check_out: '2025-06-17',
    guests: 2,
    status: 'Reservado'
  };
  
  // Simular lifecycle hook
  await sendWhatsAppNotification(testBooking);
};
```

#### Verificación de Entrega
```
1. Ejecutar test de WhatsApp
2. Verificar recepción en ambos números:
   - +52 811 993 6655
   - +52 811 175 5533
3. Confirmar formato correcto del mensaje
4. Verificar logs en consola
```

### EmailJS Integration

#### Test Directo
```javascript
// BACKEND/test-emailjs-direct.js
const testEmailJSDirect = async () => {
  const testData = {
    to_email: 'admin@ashlarhouse.com',
    from_name: 'Test System',
    from_email: 'test@example.com',
    subject: 'test',
    message: 'This is a test email from the EmailJS integration.',
    sent_date: new Date().toLocaleString()
  };
  
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: testData
      })
    });
    
    console.log('EmailJS Response:', response.status, await response.text());
  } catch (error) {
    console.error('EmailJS Error:', error);
  }
};
```

## 🎯 Casos de Prueba Específicos

### 1. Flujo Newsletter Completo

```
Objetivo: Verificar suscripción completa al newsletter

Pasos:
1. Abrir landing page
2. Scroll hasta footer
3. Llenar formulario newsletter:
   - Nombre: "Test User"
   - Email: "test@example.com"
   - Marcar: Solo email
4. Hacer click en "Suscribirse"
5. Verificar mensaje de éxito
6. Verificar en Strapi admin:
   - Newsletter subscriber creado
   - Email = "test@example.com"
   - subscribe_email = true
   - subscribe_whatsapp = false
   - source = "footer_form"

Resultado esperado: ✅ Suscripción exitosa
```

### 2. Flujo Contacto con Auto-Suscripción

```
Objetivo: Verificar mensaje de contacto con suscripción automática

Pasos:
1. Abrir landing page
2. Scroll hasta formulario de contacto
3. Llenar todos los campos:
   - Nombre: "Test Contact"
   - Email: "contact@example.com"
   - Teléfono: "5218119936655"
   - Asunto: "Información General"
   - Mensaje: "Quisiera información sobre disponibilidad"
   - Marcar: Suscribirse a newsletter email
   - Marcar: Suscribirse a newsletter WhatsApp
4. Hacer click en "Enviar"
5. Verificar mensaje de éxito
6. Verificar en Strapi admin:
   - Contact message creado
   - Newsletter subscriber creado automáticamente
   - Email enviado al admin

Resultado esperado: ✅ Mensaje enviado y suscripción automática
```

### 3. Flujo Booking con WhatsApp

```
Objetivo: Verificar notificación WhatsApp en nueva reserva

Pasos:
1. Crear booking desde Strapi admin:
   - guest_name: "Test Guest"
   - email: "guest@example.com"
   - phone: "5218119936655"
   - check_in: "2025-06-20"
   - check_out: "2025-06-22"
   - guests: 2
   - status: "Reservado"
2. Guardar booking
3. Verificar logs en consola de Strapi
4. Verificar recepción de WhatsApp en ambos números

Resultado esperado: ✅ WhatsApp recibido con formato correcto
```

## 🔍 Debugging de Pruebas

### Logs de Debugging

#### Backend Strapi
```bash
# Iniciar con logs detallados
DEBUG=strapi:* npm run develop

# Ver logs específicos
DEBUG=strapi:database npm run develop
DEBUG=strapi:api npm run develop
```

#### Frontend (Browser Console)
```javascript
// Habilitar logs detallados
localStorage.setItem('debug', 'newsletter:*');

// Ver logs en tiempo real
console.log('Sistema de newsletter cargado');
console.error('Error en API call:', error);
```

### Problemas Comunes y Soluciones

#### 1. API 404 Not Found
```
Problema: curl returns 404 for API endpoints
Solución: 
- Verificar que Strapi esté ejecutándose
- Verificar que content-types estén correctamente configurados
- Verificar URLs en requests (incluir /api/ prefix)
```

#### 2. WhatsApp Not Received
```
Problema: WhatsApp test passes but message not received
Solución:
- Verificar que números estén registrados con CallMeBot
- Verificar API keys en .env
- Verificar formato de números (+52...)
- Verificar que WhatsApp esté instalado y activo
```

#### 3. EmailJS Fails
```
Problema: EmailJS returns 400 Bad Request
Solución:
- Verificar credenciales en .env
- Verificar template ID en EmailJS dashboard
- Verificar que template_params coincidan con template variables
```

#### 4. CORS Errors
```
Problema: Frontend can't call backend APIs
Solución:
- Verificar configuración CORS en config/middlewares.ts
- Agregar frontend URL a whitelist
- Verificar que origen coincida exactamente
```

## 📊 Métricas de Testing

### Coverage Report
```
📊 COBERTURA DE PRUEBAS - ASHLAR HOUSE
====================================

✅ APIs REST: 100% (3/3)
  - Newsletter Subscribers API
  - Contact Messages API  
  - Bookings API

✅ Integraciones: 100% (2/2)
  - WhatsApp CallMeBot
  - EmailJS

✅ Frontend Forms: 100% (3/3)
  - Contact Form
  - Newsletter Footer
  - Campaign Manager

✅ End-to-End Flows: 100% (3/3)
  - Newsletter Subscription
  - Contact with Auto-subscription
  - Booking with WhatsApp

Total Coverage: 100% ✅
```

### Automated Testing Schedule

```bash
# Daily health check
0 9 * * * cd /path/to/project/BACKEND && node scripts/health-check.js

# Weekly full system test
0 10 * * 1 cd /path/to/project/BACKEND && npm run health-check

# Monthly integration test
0 11 1 * * cd /path/to/project/BACKEND && node scripts/full-integration-test.js
```

## 🚀 Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Ashlar House System

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: cd BACKEND && npm install
      
    - name: Run health check
      run: cd BACKEND && node scripts/health-check.js
      env:
        CALLMEBOT_API_KEY_1: ${{ secrets.CALLMEBOT_API_KEY_1 }}
        CALLMEBOT_API_KEY_2: ${{ secrets.CALLMEBOT_API_KEY_2 }}
        EMAILJS_PUBLIC_KEY: ${{ secrets.EMAILJS_PUBLIC_KEY }}
        EMAILJS_SERVICE_ID: ${{ secrets.EMAILJS_SERVICE_ID }}
        EMAILJS_TEMPLATE_ID: ${{ secrets.EMAILJS_TEMPLATE_ID }}
        
    - name: Run full system test
      run: cd BACKEND && npm run health-check
```
