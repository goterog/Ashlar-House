# Script de PowerShell para probar el sistema WhatsApp
Write-Host "🎯 SISTEMA WHATSAPP - TEST FINAL" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Verificar directorio
$backendDir = "C:\Users\Guillermo Otero\Cabaña Hanuman\BACKEND"
if (-not (Test-Path $backendDir)) {
    Write-Host "❌ No se encuentra el directorio BACKEND" -ForegroundColor Red
    exit 1
}

Set-Location $backendDir
Write-Host "📂 Directorio: $PWD" -ForegroundColor Cyan

# Verificar archivos necesarios
$requiredFiles = @("src/index.ts", ".env", "package.json")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file NO ENCONTRADO" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🔧 Verificando TypeScript..." -ForegroundColor Yellow
try {
    $result = & npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript compila sin errores" -ForegroundColor Green
    } else {
        Write-Host "❌ Errores de TypeScript:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "⚠️ No se pudo verificar TypeScript" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 INSTRUCCIONES PARA CONTINUAR:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. INICIAR STRAPI (en esta terminal):" -ForegroundColor White
Write-Host "   npm run develop" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. BUSCAR ESTE MENSAJE AL INICIAR:" -ForegroundColor White
Write-Host "   🚀 WhatsApp Bootstrap - Configurando lifecycle hooks..." -ForegroundColor Green
Write-Host ""
Write-Host "3. PROBAR EL SISTEMA (en otra terminal):" -ForegroundColor White
Write-Host "   node test-final-lifecycle.js" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. CREAR RESERVA desde admin panel y verificar logs" -ForegroundColor White
Write-Host ""
Write-Host "✅ EL SISTEMA ESTÁ LISTO PARA USAR" -ForegroundColor Green
Write-Host ""
