## COMPLETAR FUNCIONALIDADES EN MI LANDING PAGE 
* Menú móvil (organizar menú y ajustar comportamiento al presionar links)
* Dark mode: configurarlo para hacerlo funcional, añadir cambio visual a icono de dark mode al presionarlo. Actualmente no cambia el color de fondo de las secciones 

## Sincronización de calendario Airbnb
Ya tengo el JS BACKEND/scripts/import-aribnb-calendar.js implementado, el cual funciona obteniendo los datos de mi calendario Airbnb por medio de URL con el archivo de iCal .ics desde donde se obtienen los datos, se les da el formato correcto compatible con mi schema de bookings y se revisa el UID del evento del calendario para omitirlo si ya existe en mis bookings y no repetirlo. Analiza el script referido completo para contextualizar mejor esto.

Sin embargo, hay algunos aspectos en los que puede mejorar y que faltan configurar:
- El JS de importación no se ejecuta automaticamente, actualmente tengo una tarea programada de windows para que node ejecute cada 3 horas el script. Este método no me va a servir en producción.
Nota: el calendario de Airbnb lo actualizan cada 3 horas.

Se debe poder implementar automaticamente con un lifecycle, puedes analizar y proponer implementación para sincronización con esa aproximación, usando lifecycle. Y decirme cómo funcionaría, si se ejecuta programadamente cada 3 horas o cómo funciona con la logica de los lifecycle de Strapi.
Nota: hubo cambios en logica y funcionamiento entre las versiones de Strapi v4 y v5, documentados por Strapi en el siguiente enlace: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service#notes Documentación más general sobre los lifecycles aquí: https://docs.strapi.io/cms/backend-customization/models#lifecycle-hooks 
Revisar esa documentación para asegurar optimo funcionamiento e implementación.

- La segunda área de mejora es en cuanto a los datos que recibo del calendario de Airbnb a mi colección booking, estan bien mapeados, pero hay un dato que noté en los datos del archivo iCal que no recibo: la URL del cliente que hace la reserva, debería estar mapeada para recibirla en el campo "messaje" de bookings. Actualmente solo me llega a ese campo el texto "Reservation URL", pero no la URL. 
Puedes ayudarme para corregir eso y que llegue la URL?
Aquí hay que tener en cuenta la forma en que se estructura o presenta la información en el archivo iCal y re-estructurarla para que me llegue la URL limpia. Aquí un ejemplo de cómo se presenta esa parte en el archivo iCal:
DESCRIPTION:Reservation URL: https://www.airbnb.com/hosting/reservations/de
 tails/HMFYXJ2ZTZ\nPhone Number (Last 4 Digits): 8679
Hay un espacio y salto de renglón que cortan la URL que se debe quitar y también identificar hasta dónde llega porque pegan el final de la URL con \nPhone...
En éste ejemplo, la URL debería presentarse así: https://www.airbnb.mx/hosting/reservations/details/HMFYXJ2ZTZ en el campo "message" de mi contenido bookings.

Cualquier aclaración o sugerencia es bienvenida antes de proceder con cambios.

---

## Consideraciones para producción ##
* Crear un archivo render.yaml para automatizar la configuración cuando estés listo para desplegar en Render.
* Configuración óptima para Strapi en producción.
* Depurar librería CSS en Frontend HTML para optimizar carga de sitio. 
* Considerar otras librerías para depuración.
* Migrar base de datos a PostgreSQL

---

## TAREAS COMPLETADAS ##
## RECIBIR RESERVAS POR WHATSAPP ##
Cada vez que se cree una nueva entrada en mi api/bookings de Strapi enviarme automaticamente un mensaje a dos diferentes números de Whatsapp (+5218119936655 y +5218111755533) con los siguiente mensajes: (usar schema.json de api booking como referencia de campos)
* Si se lee "estado" = "Bloqueado" los mensajes serían:
- Se ha "estado" el día "start" desde mi "source" (para un solo día bloqueado)
- Se han "estado" los días "start" al "end" desde mi "source" (para más de un día bloqueado)
* Si se lee "estado" = "Reservado" los mensajes serían:
- Se ha "estado" el día "start" desde mi "source" (si se reserva un solo día)
- Se han "estado" los días "start" al "end" desde mi "source" (para más de un día bloqueado)
* Si en el caso de que en el "estado" = "Reservado" existen otros campos como "name", "guest", "phone", "email", "message" también agregar al mensaje:
- Con los siguientes datos de reservación:
Nombre: "name"
Número de huéspedes: "guest"
Teléfono: "phone"
E-mail: "email"
Mensaje del huésped: "message"
(solo mostrar los campos existentes en el mensaje)

