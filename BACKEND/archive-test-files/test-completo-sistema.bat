@echo off
title Strapi WhatsApp Test System
color 0A

echo ===============================================
echo       SISTEMA DE PRUEBAS WHATSAPP STRAPI
echo ===============================================
echo.

echo [1] Navegando al directorio de BACKEND...
cd /d "C:\Users\Guillermo Otero\Cabaña Hanuman\BACKEND"

echo [2] Verificando archivos necesarios...
if not exist "src\index.ts" (
    echo ERROR: No se encuentra src\index.ts
    pause
    exit
)

if not exist ".env" (
    echo ERROR: No se encuentra el archivo .env
    pause
    exit
)

echo [3] Compilando TypeScript (si es necesario)...
npx tsc --noEmit

echo [4] Iniciando Strapi en modo desarrollo...
echo IMPORTANTE: Busca estos mensajes al iniciar:
echo    "🚀 WhatsApp Bootstrap - Configurando lifecycle hooks..."
echo.

start "Strapi Server" cmd /k "npm run develop"

echo [5] Esperando a que Strapi se inicie completamente...
timeout /t 20 /nobreak >nul

echo [6] Ejecutando test de lifecycle hooks...
echo.
node test-final-lifecycle.js

echo.
echo ===============================================
echo                   FINALIZADO
echo ===============================================
echo Presiona cualquier tecla para continuar...
pause >nul
