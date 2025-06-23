# 📚 Documentación Ashlar House
*Sistema Completo de Gestión Turística - Actualizado: 13 de Junio, 2025*

## 🎯 Índice General

### 🏗️ [ARQUITECTURA](./ARCHITECTURE/)
- [Visión General del Sistema](./ARCHITECTURE/system-overview.md)
- [Arquitectura Backend](./ARCHITECTURE/backend-architecture.md) 
- [Arquitectura Frontend](./ARCHITECTURE/frontend-architecture.md)

### 🔌 [APIs REST](./API/)
- [Newsletter API](./API/newsletter-api.md)
- [Contact Messages API](./API/contact-api.md)
- [Bookings API](./API/booking-api.md)

### ⚙️ [CONFIGURACIÓN](./SETUP/)
- [Setup de Desarrollo](./SETUP/development-setup.md)
- [Despliegue en Producción](./SETUP/production-deployment.md)
- [Configuración de Entorno](./SETUP/environment-config.md)

### 🔗 [INTEGRACIONES](./INTEGRATIONS/)
- [WhatsApp CallMeBot](./INTEGRATIONS/whatsapp-setup.md)
- [EmailJS Configuration](./INTEGRATIONS/emailjs-setup.md)
- [Sincronización Airbnb](./INTEGRATIONS/airbnb-sync.md)

### 🧪 [TESTING](./TESTING/)
- [Guía de Pruebas](./TESTING/testing-guide.md)
- [Scripts de Testing](./TESTING/test-scripts.md)

### 📜 [HISTORIAL](./HISTORY/)
- [Implementaciones](./HISTORY/implementations.md)
- [Changelog](./HISTORY/changelog.md)

---

## 🚀 Estado Actual del Proyecto

### ✅ Funcionalidades Completadas (100%)

#### 🏠 Sistema Principal
- **Landing Page**: HTML responsive con Tailwind CSS
- **Backend CMS**: Strapi v5 + TypeScript
- **Base de Datos**: SQLite con content types completos
- **APIs REST**: Generadas automáticamente

#### 📱 Notificaciones WhatsApp
- **CallMeBot Integration**: Dual phone numbers configurados
- **Lifecycle Hooks**: Automáticos en reservas/bloqueos
- **Error Handling**: Logging completo y robusto

#### 📧 Sistema Newsletter & Contacto
- **Newsletter Dual**: Email + WhatsApp simultáneo
- **EmailJS**: Configurado con credenciales de producción
- **APIs REST**: Endpoints `/newsletter-subscribers` y `/contact-messages`
- **Formularios**: Validación completa con feedback visual

#### 🛠️ Herramientas DevOps
- **Scripts Suite**: Herramientas completas en `/scripts`
- **Health Checks**: Verificación automática del sistema
- **Environment Setup**: Configurador automático
- **Testing Suite**: Pruebas end-to-end implementadas

---

## 🏃‍♂️ Quick Start

### Desarrollo Local
```bash
# Backend (Terminal 1)
cd BACKEND
npm install
npm run develop

# Frontend (Terminal 2) 
cd FRONTEND  
# Abrir Ashlar House.html en navegador
```

### Verificación del Sistema
```bash
# Ejecutar suite de pruebas
cd BACKEND
node test-secure-email-system.js
```

---

## 📞 Contacto y Soporte

- **Proyecto**: Ashlar House Tourism Management System
- **Stack**: Strapi v5 + TypeScript + HTML/JavaScript
- **Estado**: ✅ Producción Ready
- **Última Actualización**: 13 de Junio, 2025

Para más detalles técnicos, consulta las secciones específicas de esta documentación.
