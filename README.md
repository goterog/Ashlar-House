* Recordatorios del proyecto 

- El script de importación de Airbnb (import-airbnb-calendar.js) debe ejecutarse cada 3 horas para mejor sincronía.

Aquí tienes un adelanto de cómo podrías automatizar la ejecución del script:

---

## 1. En servidores Linux (Ubuntu, Debian, etc.)

La forma más común es usando **cron**:

1. Abre el crontab del usuario que ejecuta Strapi:
   ```bash
   crontab -e
   ```

2. Agrega esta línea para ejecutar el script cada 3 horas:
   ```bash
   0 */3 * * * cd /ruta/a/tu/BACKEND/scripts && /usr/bin/node import-airbnb-calendar.js >> /ruta/a/tu/BACKEND/scripts/airbnb-sync.log 2>&1
   ```
   - Cambia `/ruta/a/tu/BACKEND/scripts` por la ruta real en tu servidor.
   - El log es opcional, pero útil para depuración.

---

## 2. En servidores Windows

Usa el **Programador de tareas de Windows** (Task Scheduler), como te expliqué antes:

- Crea una tarea que ejecute:
  ```
  node C:\ruta\a\tu\BACKEND\scripts\import-airbnb-calendar.js
  ```
- Programa la tarea para que se repita cada 3 horas.

---

## 3. Alternativa: Usar un servicio externo

Si tu servidor no permite cron o tareas programadas, puedes usar servicios como [EasyCron](https://www.easycron.com/) o GitHub Actions (si tu backend está en la nube y puedes hacer webhooks o scripts remotos).

---

## 4. Automatización dentro de Strapi (avanzado)

Puedes crear un plugin o usar el lifecycle de Strapi para ejecutar el script periódicamente, pero lo más sencillo y robusto es usar cron o el programador de tareas del sistema operativo.

---

**Resumen:**  
- En Linux: usa cron.
- En Windows: usa el Programador de tareas.
- En ambos casos, asegúrate de que Node.js esté en el PATH y que la ruta al script sea correcta.