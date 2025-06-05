### Recordatorios del proyecto 

**El calendario de Airbnb se actualiza cada 3 horas, por lo que el script de importación de Airbnb (import-airbnb-calendar.js) también debe ejecutarse cada 3 horas para mejor sincronía.**

## En servidores Windows

Usa el **Programador de tareas de Windows** (Task Scheduler):

- Crea una tarea que ejecute:
  ```
  node C:\ruta\a\tu\BACKEND\scripts\import-airbnb-calendar.js
  ```
- Programa la tarea para que se repita cada 3 horas.

## Automatización dentro de Strapi

Puedes crear un plugin o usar el lifecycle de Strapi para ejecutar el script periódicamente, pero lo más sencillo y robusto es usar cron o el programador de tareas del sistema operativo.

## Alternativa: Usar un servicio externo

Si tu servidor no permite cron o tareas programadas, puedes usar servicios como [EasyCron](https://www.easycron.com/) o GitHub Actions (si tu backend está en la nube y puedes hacer webhooks o scripts remotos).

Asegúrate de que Node.js esté en el PATH y que la ruta al script sea correcta.