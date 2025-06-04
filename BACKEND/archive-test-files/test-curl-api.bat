@echo off
echo 🧪 TEST DEFINITIVO - API LIFECYCLE HOOKS
echo ========================================
echo.
echo 📤 Enviando POST request a Strapi API...
echo Esto deberia disparar el lifecycle hook si funciona.
echo.
echo ⏰ Revisa la consola de Strapi para ver:
echo 🚀🚀🚀 LIFECYCLE HOOK EJECUTADO! 🚀🚀🚀
echo.

curl -X POST http://localhost:1337/api/bookings ^
  -H "Content-Type: application/json" ^
  -d "{\"data\": {\"title\": \"Test Curl\", \"start\": \"2025-06-05\", \"end\": \"2025-06-06\", \"estado\": \"Reservado\", \"source\": \"Landing page\", \"name\": \"Test Curl User\", \"email\": \"test@curl.com\", \"phone\": \"+52-555-999888\", \"guest\": \"2\", \"message\": \"Test con curl para lifecycle\"}}"

echo.
echo.
echo 📋 Si ves el mensaje del lifecycle hook en Strapi, ¡FUNCIONA!
echo 📋 Si NO ves el mensaje, hay un problema con la configuracion de Strapi v5.
pause
