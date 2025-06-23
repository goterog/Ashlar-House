# 🏠 Ashlar House - Sistema de Gestión Turística

*Última actualización: 13 de Junio, 2025*

## 🎯 Resumen del Proyecto

**Ashlar House** es un sistema completo de gestión para propiedades turísticas que combina:
- **Landing Page** moderna y responsive con formularios inteligentes
- **Sistema de Reservas** con calendario en tiempo real sincronizado
- **CMS Backend** (Strapi v5 + TypeScript) con APIs REST automáticas
- **Notificaciones WhatsApp** automáticas duales para nuevas reservas
- **Sistema de Newsletter** dual (Email + WhatsApp) con auto-suscripción
- **Sincronización Airbnb** automática cada 3 horas
- **Campaign Management** para gestión de suscriptores y listas
- **Testing Suite** completo para verificación del sistema

![FRONTEND/assets/images/logo.png](FRONTEND/assets/images/logo.png)

## ✨ Funcionalidades Completadas

### 🏠 Sistema Principal
- ✅ **Landing Page Responsive** - Diseño moderno con Tailwind CSS
- ✅ **Galería Visual** - Fotos y video hero interactivos
- ✅ **Modo Claro/Oscuro** - Tema adaptable
- ✅ **Calendario Interactivo** - FullCalendar con disponibilidad en tiempo real
- ✅ **SEO Optimizado** - Meta tags y estructura semántica

### 📱 Sistema de Notificaciones WhatsApp
- ✅ **Dual Phone Delivery** - Envío automático a dos números
- ✅ **CallMeBot Integration** - API configurada y funcionando
- ✅ **Lifecycle Hooks** - Automatización completa en Strapi
- ✅ **Formateo Inteligente** - Mensajes personalizados por tipo de evento
- ✅ **Error Handling** - Manejo robusto con logging detallado

### 📧 Sistema de Newsletter y Contacto
- ✅ **Newsletter Dual** - Suscripción simultánea Email + WhatsApp
- ✅ **EmailJS Integration** - Configurado con credenciales de producción
- ✅ **Auto-Suscripción** - Desde formulario de contacto
- ✅ **Validación Avanzada** - Frontend y backend con TypeScript
- ✅ **Campaign Manager** - Gestión de listas y exportación de datos
- ✅ **Formularios Inteligentes** - Estados de carga y feedback visual

### 🔄 Automatización
- ✅ **Sincronización Airbnb** - iCal automático cada 3 horas
- ✅ **Cron Jobs** - Programación automática de tareas
- ✅ **Lifecycle Automation** - Hooks para eventos del sistema
- ✅ **Health Checks** - Monitoreo automático del sistema

## Stack Tecnológico
- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript vanilla
- **Backend**: Strapi v5 + TypeScript como CMS headless
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Notificaciones**: CallMeBot WhatsApp API con lifecycle hooks
- **Email Service**: EmailJS para newsletter y notificaciones automáticas
- **APIs**: RESTful APIs generadas por Strapi + EmailJS integration
- **Runtime**: Node.js 18+ con fetch nativo (recomendado: 22+)
- **Control de versiones**: Git/GitHub
- **Despliegue**: Render.com (configurado)

## Estructura del Proyecto
```
/
├── FRONTEND/              # Interfaz de usuario (Landing Page)
│   ├── assets/            # Imágenes, videos y recursos estáticos
│   ├── js/               # Scripts de JavaScript
│   │   ├── newsletter.js  # Sistema completo de newsletter dual
│   │   └── newsletter-config.js # Configuración EmailJS
│   ├── test-newsletter.html # Página de pruebas del sistema
│   ├── EMAILJS-SETUP.md   # Guía de configuración EmailJS
│   └── Ashlar House.html  # Archivo HTML principal
├── BACKEND/               # Servidor Strapi v5 + TypeScript
│   ├── src/               # Código fuente de Strapi
│   │   ├── index.ts       # Bootstrap y lifecycle hooks WhatsApp 
│   │   └── api/          # APIs y content types
│   │       ├── newsletter-subscriber/ # API para suscriptores newsletter
│   │       └── contact-message/       # API para mensajes de contacto
│   ├── config/           # Configuración de Strapi
│   ├── scripts/          # Utilidades y herramientas de desarrollo
│   └── archive-test-files/ # Archivos de test archivados (desarrollo)
├── DEVELOPMENT.md         # Guía completa de desarrollo 
└── README.md              # Este archivo
```

## Instalación y Configuración

### Requisitos Previos
- Node.js (v18 o superior, recomendado: v22+)
- npm o yarn
- Git

### Configuración del Entorno de Desarrollo
1. Clonar el repositorio:
```bash
git clone https://github.com/goterog/Caba-a-Hanuman.git 
cd cabaña-hanuman
```

2. Instalar dependencias del backend:
```bash
cd BACKEND
npm install
```

3. Configurar variables de entorno:
```bash
# Copiar y editar el archivo de ejemplo
cp .env.example .env
# Configurar las API keys de CallMeBot y otras variables
```

4. Iniciar el servidor Strapi:
```bash
npm run develop
```

5. Configurar EmailJS (opcional, para newsletter):
   - Seguir la guía en `FRONTEND/EMAILJS-SETUP.md`
   - Configurar credenciales en `FRONTEND/js/newsletter-config.js`

6. Iniciar el servidor frontend:
```bash
cd FRONTEND
python -m http.server 8000    # Servidor local en puerto 8000
# Acceder a http://localhost:8000 para la landing page
# Acceder a http://localhost:8000/test-newsletter.html para pruebas
```

### ⚡ Scripts Útiles
```bash
# Backend
npm run develop    # Modo desarrollo con auto-reload
npm run build      # Build para producción
npm run start      # Modo producción

# Herramientas de desarrollo
npm run dev-tools                      # Script maestro con menú
node scripts/health-check.js           # Verificación rápida del sistema completo
node scripts/check-strapi.js           # Verificar conectividad
node scripts/simple-whatsapp-test.js   # Test WhatsApp directo
node scripts/final-simple-test.js      # Test completo del sistema WhatsApp
node scripts/diagnostico-completo.js   # Diagnóstico detallado
```

## Metodología de Desarrollo
Este proyecto sigue un enfoque iterativo con las siguientes prácticas:
- Desarrollo por ramas para experimentar con nuevas características
- Merge a main solo cuando las características están estables
- Enfoque en usabilidad y experiencia de usuario
- Optimización progresiva de rendimiento
- **TypeScript-first approach** con Strapi v5
- **Lifecycle hooks** para automatización de procesos
- **Comprehensive testing** con herramientas de desarrollo

## 📖 Documentación Completa

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guía completa de desarrollo y arquitectura
- **[PROJECT-STATUS.md](PROJECT-STATUS.md)** - Estado actual y funcionalidades completadas
- **[BACKEND/scripts/README.md](BACKEND/scripts/README.md)** - Documentación de herramientas de desarrollo

## Próximos Pasos
- [x] ~~Integrar sistema de notificaciones de reserva por WhatsApp~~ ✅ **Completado**
- [x] ~~Implementar lifecycle hooks para automatización~~ ✅ **Completado**
- [x] ~~Configurar dual API keys para múltiples números~~ ✅ **Completado**
- [x] ~~Crear documentación de desarrollo completa~~ ✅ **Completado**
- [x] ~~Sistema de Newsletter Dual (Email + WhatsApp)~~ ✅ **Completado**
- [x] ~~Integración EmailJS para notificaciones automáticas~~ ✅ **Completado**
- [x] ~~APIs para contact-message y newsletter-subscriber~~ ✅ **Completado**
- [ ] Optimizar carga de imágenes con lazy loading
- [ ] Migrar base de datos para producción a PostgreSQL
- [ ] Implementar sistema de respaldos automáticos
- [ ] Añadir tests unitarios e integración automatizados
- [ ] Implementar retry logic robusto para notificaciones
- [ ] Sistema de logging estructurado con Winston

## Contribuciones y Sugerencias
Este proyecto está siendo desarrollado como una oportunidad de aprendizaje, por lo que las sugerencias, recomendaciones y explicaciones sobre mejores prácticas son bienvenidas. Si tienes ideas para mejorar el código, la arquitectura o añadir nuevas características, no dudes en compartirlas.

Como desarrollador en proceso de aprendizaje, aprecio especialmente:
- Explicaciones detalladas de conceptos
- Sugerencias de refactorización
- Recomendaciones sobre patrones de diseño
- Consejos para optimización

## Contacto
Para cualquier consulta relacionada con este proyecto, puedes contactarme a través de guillermo.a.otero@gmail.com

---

*Este README es un documento vivo que se actualizará a medida que el proyecto evolucione.*