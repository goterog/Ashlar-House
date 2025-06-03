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
- ✅ Sección de testimonios de visitantes anteriores
- ✅ Información sobre experiencias locales y actividades cercanas
- ✅ Formulario de contacto con integración a WhatsApp
- ✅ SEO optimizado para búsquedas locales

## Stack Tecnológico
- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **Backend**: Strapi v5 como CMS headless
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Control de versiones**: Git/GitHub
- **Despliegue**: Render.com (planificado)

## Estructura del Proyecto
```
/
├── FRONTEND/              # Archivos de la interfaz de usuario
│   ├── assets/            # Imágenes, videos y recursos estáticos
│   └── cabaña hanuman08.html  # Archivo HTML principal
├── BACKEND/               # Servidor Strapi y API
│   ├── src/               # Código fuente de Strapi
│   └── .tmp/             # Base de datos SQLite (no versionada)
└── README.md              # Este archivo
```

## Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
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

3. Iniciar el servidor Strapi:
```bash
npm run develop
```

4. Abrir el archivo HTML en un navegador o usar una extensión como Live Server en VS Code para el frontend.

## Metodología de Desarrollo
Este proyecto sigue un enfoque iterativo con las siguientes prácticas:
- Desarrollo por ramas para experimentar con nuevas características
- Merge a main solo cuando las características están estables
- Enfoque en usabilidad y experiencia de usuario
- Optimización progresiva de rendimiento

## Próximos Pasos
- [ ] Integrar sistema de notificaciones de reserva por WhatsApp
- [ ] Optimizar carga de imágenes con lazy loading
- [ ] Migrar base de datos para producción
- [ ] Configurar despliegue automatizado en Render.com

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