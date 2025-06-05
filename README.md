# Ashlar House - Landing Page

## Descripción del Proyecto
Ashlar House es una landing page para la presentación y gestión de reservas de una propiedad turística ubicada en Ciénega de González, Santiago N.L. El proyecto está siendo desarrollado como una oportunidad de aprendizaje, experimentando con tecnologías web modernas y mejores prácticas de desarrollo.

![Ashlar House Logo](FRONTEND/assets/images/logo.png)

## Características Principales
- ✅ Diseño responsivo para móvil y escritorio
- ✅ Presentación visual con galería de fotos y video hero
- ✅ Modo claro/oscuro
- ✅ Modal para reservación
- ✅ Calendario de disponibilidad interactivo
- ✅ Sistema de notificaciones WhatsApp automáticas
- ✅ Sección de testimonios de visitantes anteriores
- ✅ Información sobre experiencias locales y actividades cercanas
- ✅ Formulario de contacto con integración a WhatsApp
- ✅ SEO optimizado para búsquedas locales

## Stack Tecnológico
- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript vanilla
- **Backend**: Strapi v5 + TypeScript como CMS headless
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Notificaciones**: CallMeBot WhatsApp API con lifecycle hooks
- **Runtime**: Node.js 18+ con fetch nativo (recomendado: 22+)
- **Control de versiones**: Git/GitHub
- **Despliegue**: Render.com (configurado)

## Estructura del Proyecto
```
/
├── FRONTEND/              # Interfaz de usuario (Landing Page)
│   ├── assets/            # Imágenes, videos y recursos estáticos
│   ├── js/               # Scripts de JavaScript
│   └── Ashlar House.html  # Archivo HTML principal
├── BACKEND/               # Servidor Strapi v5 + TypeScript
│   ├── src/               # Código fuente de Strapi
│   │   ├── index.ts       # Bootstrap y lifecycle hooks WhatsApp 
│   │   └── api/          # APIs y content types
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

5. Abrir el archivo HTML en un navegador o usar una extensión como Live Server en VS Code para el frontend.

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