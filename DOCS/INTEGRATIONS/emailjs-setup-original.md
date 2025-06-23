# Configuración de EmailJS para Newsletter

## 📧 Configuración EmailJS (Opción Gratuita Recomendada)

### Paso 1: Crear Cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Confirma tu email

### Paso 2: Configurar Servicio de Email
1. En el dashboard, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor (Gmail recomendado):
   - **Gmail**: Más fácil de configurar
   - **Outlook**: También funciona bien
   - **Custom SMTP**: Para otros proveedores

#### Para Gmail:
1. Selecciona **Gmail**
2. Conecta tu cuenta de Gmail
3. Autoriza el acceso a EmailJS
4. Copia el **Service ID** (lo necesitarás después)

### Paso 3: Crear Template de Email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Configura el template:

```html
Subject: Nuevo mensaje de contacto - Ashlar House

From Name: {{from_name}}
From Email: {{from_email}}
To Name: Ashlar House
To Email: tu-email@ejemplo.com

Mensaje:
Nombre: {{from_name}}
Email: {{from_email}}
Asunto: {{subject}}

Mensaje:
{{message}}

---
Enviado desde: ashlarhouse.com
Fecha: {{fecha}}
```

4. Guarda el template y copia el **Template ID**

### Paso 4: Obtener Public Key
1. Ve a **Integration**
2. Copia tu **Public Key**

### Paso 5: Configurar en tu sitio web
Edita el archivo `js/newsletter.js` y actualiza estas líneas:

```javascript
// Configuración
const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY_AQUI'; // Pegar tu Public Key
const EMAILJS_SERVICE_ID = 'TU_SERVICE_ID_AQUI'; // Pegar tu Service ID  
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID_AQUI'; // Pegar tu Template ID
```

## 🔧 Configuración Alternativa: Servicios Profesionales

### Opción 1: Mailgun (Intermedio)
- **Precio**: 1,000 emails gratis/mes
- **Configuración**: Más técnica pero muy confiable
- **Ideal para**: Proyectos que crecen rápido

### Opción 2: SendGrid (Premium)
- **Precio**: 100 emails gratis/día
- **Características**: Analytics avanzados, deliverability superior
- **Ideal para**: Proyectos profesionales

## 🚀 Configuración en Producción

### Variables de Entorno Recomendadas
Crea un archivo `.env` en tu frontend:

```env
EMAILJS_PUBLIC_KEY=tu_public_key
EMAILJS_SERVICE_ID=tu_service_id
EMAILJS_TEMPLATE_ID=tu_template_id
STRAPI_URL=https://tu-strapi-url.com
```

### Script de Configuración Automática
```javascript
// En newsletter.js - versión producción
const CONFIG = {
  EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY',
  EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  STRAPI_URL: process.env.STRAPI_URL || 'http://localhost:1337'
};
```

## 📊 Monitoreo y Analytics

### Dashboard de EmailJS
- Ve a **Dashboard** para ver estadísticas
- Revisa emails enviados, entregados y fallidos
- Configura alertas para errores

### Logs en Strapi
Los suscriptores se guardan automáticamente en:
- **Newsletter Subscribers**: Lista completa de suscriptores
- **Contact Messages**: Todos los mensajes de contacto

## ⚙️ Personalización Avanzada

### Templates Personalizados
Puedes crear diferentes templates para:
- Mensajes de contacto generales
- Solicitudes de reserva
- Confirmaciones de suscripción
- Emails promocionales

### Automatización
Con Strapi puedes crear automáticamente:
- Emails de bienvenida
- Campañas de marketing
- Recordatorios de disponibilidad

## 🔒 Consideraciones de Privacidad

### GDPR Compliance
- Checkbox obligatorio para suscripciones
- Política de privacidad clara
- Opción de desuscripción fácil

### Datos Seguros
- Validación de emails
- Encriptación de datos sensibles
- Backup regular de listas de suscriptores

## 📞 Soporte y Solución de Problemas

### Errores Comunes
1. **Public Key inválida**: Verificar en EmailJS dashboard
2. **Template no encontrado**: Revisar Template ID
3. **Emails no llegan**: Verificar spam/junk folders

### Testing
Usa el modo de desarrollo para probar:
```javascript
// Modo debug
emailjs.init(EMAILJS_PUBLIC_KEY, { debug: true });
```

¡Tu sistema de newsletter estará listo en pocos minutos! 🎉
