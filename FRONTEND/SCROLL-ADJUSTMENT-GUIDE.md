# Guía de Ajustes de Scroll - Ashlar House Landing Page

## 📍 Cómo ajustar el scroll por sección

### Ubicación del código
El código de configuración de scroll está en `src/index.html` en la sección de JavaScript, busca la variable `SCROLL_OFFSETS`.

### Configuración actual

```javascript
const SCROLL_OFFSETS = {
    mobile: {
        '#inicio': 0,                   // Sin offset para la sección hero
        '#cabana': 40,                  // Espacio adicional sobre el header
        '#disponibilidad': 50,          // Más espacio para el calendario
        '#ubicacion': 40,               // Espacio estándar
        '#experiencias': 40,            // Espacio estándar
        '#testimonios': 40,             // Si tienes esta sección
        '#contacto': 40,                // Espacio estándar
        'default': 30                   // Valor por defecto
    },
    desktop: {
        '#inicio': 0,                   // Sin offset para la sección hero
        '#cabana': 20,                  // Ajuste fino para desktop
        '#disponibilidad': 10,          // Menos espacio en desktop
        '#ubicacion': 15,               // Ajuste específico
        '#experiencias': 25,            // Puede necesitar más espacio
        '#testimonios': 20,             // Si tienes esta sección
        '#contacto': 30,                // Más espacio para el formulario
        'default': 70                   // Valor por defecto para desktop
    }
};
```

## 🔧 Cómo hacer ajustes

### 1. Para ajustar una sección específica en MÓVIL:
```javascript
mobile: {
    '#cabana': 60,  // Cambiar de 40 a 60 pixels para más espacio
}
```

### 2. Para ajustar una sección específica en DESKTOP:
```javascript
desktop: {
    '#disponibilidad': 25,  // Cambiar de 10 a 25 pixels para más espacio
}
```

### 3. Para ajustar el valor por defecto:
```javascript
mobile: {
    'default': 50  // Cambiar de 30 a 50 pixels
}
```

## 📱 Valores recomendados por tipo de sección

### Móvil (768px y menor):
- **Hero/Inicio**: `0` (sin offset)
- **Secciones con imágenes grandes**: `40-60` pixels
- **Secciones con calendarios/mapas**: `50-70` pixels
- **Secciones de texto**: `30-40` pixels
- **Formularios**: `40-60` pixels

### Desktop (769px y mayor):
- **Hero/Inicio**: `0` (sin offset)
- **Secciones normales**: `15-30` pixels
- **Secciones con elementos complejos**: `20-40` pixels
- **Formularios**: `30-50` pixels

## 🧪 Cómo probar los cambios

1. **Abrir Chrome DevTools** (F12)
2. **Activar vista móvil** (Ctrl+Shift+M)
3. **Seleccionar dispositivo** (iPhone, Samsung Galaxy, etc.)
4. **Hacer clic en enlaces del menú** y verificar que aterrice correctamente
5. **Cambiar a vista desktop** y repetir las pruebas

## 🐛 Solución de problemas comunes

### Problema: El scroll va muy arriba
**Solución**: Aumentar el valor del offset
```javascript
'#cabana': 60,  // Era 40, aumentar a 60
```

### Problema: El scroll va muy abajo
**Solución**: Disminuir el valor del offset
```javascript
'#cabana': 20,  // Era 40, disminuir a 20
```

### Problema: Una sección no está configurada
**Solución**: Agregar la sección al objeto
```javascript
mobile: {
    '#nueva-seccion': 40,  // Agregar nueva sección
    // ...otras secciones
}
```

## 📊 Log de debugging

El código incluye logs en la consola del navegador que te muestran:
- Dispositivo detectado (móvil/desktop)
- Altura del header
- Offset adicional aplicado
- Offset final calculado
- Posición objetivo

Para verlos:
1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Hacer clic en un enlace del menú
4. Ver los logs que empiezan con "📍 Navegando a..."

## ⚙️ Configuración CSS adicional

Los estilos CSS en la sección `<style>` también afectan el scroll. Si necesitas ajustes más finos, puedes modificar:

```css
/* Para móvil */
@media (max-width: 768px) {
    #cabana {
        scroll-margin-top: calc(var(--header-height) + 2.5rem);
    }
}

/* Para desktop */
@media (min-width: 769px) {
    #cabana {
        scroll-margin-top: calc(var(--header-height) + 1.25rem);
    }
}
```

## 🚀 Tip pro: Usar la consola para pruebas rápidas

Puedes probar valores temporalmente en la consola del navegador:

```javascript
// Cambiar valor temporalmente
SCROLL_OFFSETS.mobile['#cabana'] = 70;

// O probar un scroll específico
window.scrollTo({
    top: document.querySelector('#cabana').getBoundingClientRect().top + window.scrollY - 100,
    behavior: 'smooth'
});
```

---

## 📝 Historial de cambios
- **v1.0**: Implementación inicial con configuración granular por sección
- Configuración separada para móvil y desktop
- Sistema de logs para debugging
- Manejo inteligente del menú móvil
