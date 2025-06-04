## RECIBIR RESERVAS POR WHATSAPP ##
Cada vez que se cree una nueva entrada en mi api/bookings de Strapi enviarme automaticamente un mensaje a dos diferentes números de Whatsapp (+52-8119936655 y +52-8111755533) con los siguiente mensajes: (usar schema.json de api booking como referencia de campos)
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


## Consideraciones para producción ##
* Crear un archivo render.yaml para automatizar la configuración cuando estés listo para desplegar en Render.
* La configuración óptima para Strapi en producción.
* Depurar librería CSS para optimizar carga de sitio. 
* Considerar otras librerías para depuración.
* Ajustes necesarios para la base de datos.