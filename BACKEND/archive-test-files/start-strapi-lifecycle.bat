@echo off
echo =====================================================
echo Iniciando Strapi con Lifecycle Hooks para WhatsApp
echo =====================================================
cd /d "C:\Users\Guillermo Otero\Cabaña Hanuman\BACKEND"
echo Directorio actual: %CD%
echo.
echo Iniciando Strapi...
npm run develop
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
