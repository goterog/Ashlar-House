📋 PASOS PARA VERIFICAR LIFECYCLE HOOKS EN STRAPI V5
====================================================

✅ COMPLETADO:
- Agregado logging detallado al lifecycle hook
- Console.log agregado al inicio de afterCreate
- Logging del estado de la reserva
- Logging detallado del proceso de WhatsApp

🔄 PRÓXIMOS PASOS:

1. VERIFICAR QUE STRAPI ESTÉ CORRIENDO:
   - Abrir navegador en http://localhost:1337/admin
   - Si no está corriendo, ejecutar: npm run develop

2. CREAR UNA RESERVA DE PRUEBA:
   - Ir a Content Manager > Booking
   - Crear nueva entrada con:
     * Título: "Test WhatsApp"
     * Start: 2025-06-04
     * End: 2025-06-05
     * Estado: "Reservado" (IMPORTANTE!)
     * Source: "Landing page"
     * Name: "Test User"
     * Email: "test@test.com"

3. VERIFICAR LOGS EN LA CONSOLA:
   Deberías ver mensajes como:
   🚀 LIFECYCLE HOOK TRIGGERED - afterCreate ejecutado!
   📊 Event data: [datos de la reserva]
   📋 Booking estado: Reservado
   ✅ Estado válido para notificación WhatsApp - enviando...
   📱 Iniciando envío de notificación WhatsApp...

4. SI NO VES LOS LOGS:
   - El lifecycle hook NO se está ejecutando
   - Problema con la configuración de Strapi v5
   - Posibles soluciones:
     a) Reiniciar Strapi completamente
     b) Verificar estructura de archivos
     c) Verificar sintaxis del lifecycle

5. SI VES LOS LOGS PERO NO LLEGAN WHATSAPP:
   - El hook funciona, problema con la API
   - Verificar API keys en .env
   - Verificar conexión a internet

🎯 OBJETIVO:
Confirmar si el lifecycle hook se ejecuta al crear reservas desde el admin panel.
