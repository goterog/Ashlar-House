#!/usr/bin/env node

/**
 * 🚀 Pre-Deploy Check - Ashlar House
 * Verificación completa antes de desplegar a producción
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Configuración de verificaciones
const REQUIRED_ENV_VARS = [
    'CALLMEBOT_API_KEY_1',
    'CALLMEBOT_API_KEY_2',
    'APP_KEYS',
    'API_TOKEN_SALT',
    'ADMIN_JWT_SECRET',
    'JWT_SECRET'
];

const CRITICAL_FILES = [
    'src/index.ts',
    'package.json',
    'tsconfig.json',
    'config/database.ts',
    'config/server.ts'
];

console.log('🚀 Pre-Deploy Check - Ashlar House\n');

function checkEnvironmentVariables() {
    console.log('📋 Verificando variables de entorno...');
    let allPresent = true;
    
    REQUIRED_ENV_VARS.forEach(varName => {
        if (process.env[varName]) {
            console.log(`  ✅ ${varName}`);
        } else {
            console.log(`  ❌ ${varName} - FALTANTE`);
            allPresent = false;
        }
    });
    
    return allPresent;
}

function checkCriticalFiles() {
    console.log('\n📁 Verificando archivos críticos...');
    let allPresent = true;
    
    CRITICAL_FILES.forEach(filePath => {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            console.log(`  ✅ ${filePath}`);
        } else {
            console.log(`  ❌ ${filePath} - NO ENCONTRADO`);
            allPresent = false;
        }
    });
    
    return allPresent;
}

function checkPackageJson() {
    console.log('\n📦 Verificando package.json...');
    
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        // Verificar scripts esenciales
        const requiredScripts = ['build', 'start', 'develop'];
        let scriptsOk = true;
        
        requiredScripts.forEach(script => {
            if (packageJson.scripts && packageJson.scripts[script]) {
                console.log(`  ✅ Script "${script}" definido`);
            } else {
                console.log(`  ❌ Script "${script}" faltante`);
                scriptsOk = false;
            }
        });
        
        // Verificar dependencias críticas
        const criticalDeps = ['@strapi/strapi'];
        let depsOk = true;
        
        criticalDeps.forEach(dep => {
            if (packageJson.dependencies && packageJson.dependencies[dep]) {
                console.log(`  ✅ Dependencia "${dep}" presente`);
            } else {
                console.log(`  ❌ Dependencia "${dep}" faltante`);
                depsOk = false;
            }
        });
        
        return scriptsOk && depsOk;
        
    } catch (error) {
        console.log(`  ❌ Error leyendo package.json: ${error.message}`);
        return false;
    }
}

async function checkWhatsAppConnectivity() {
    console.log('\n📱 Verificando conectividad WhatsApp...');
    
    const testNumber = '+5218119936655';
    const apiKey = process.env.CALLMEBOT_API_KEY_1;
    
    if (!apiKey) {
        console.log('  ❌ API Key no configurada');
        return false;
    }
    
    try {
        const testMessage = '🧪 Pre-deploy test - Ashlar House';
        const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(testNumber)}&text=${encodeURIComponent(testMessage)}&apikey=${apiKey}`;
        
        const response = await fetch(url);
        
        if (response.ok) {
            console.log('  ✅ API de WhatsApp responde correctamente');
            return true;
        } else {
            console.log(`  ❌ Error en API de WhatsApp: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`  ❌ Error de conectividad: ${error.message}`);
        return false;
    }
}

function checkTypeScriptConfig() {
    console.log('\n📘 Verificando configuración TypeScript...');
    
    try {
        const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
        const tsconfigText = fs.readFileSync(tsconfigPath, 'utf8');
        const parsed = ts.parseConfigFileTextToJson(tsconfigPath, tsconfigText);
        
        if (parsed.error) {
            const message = ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n');
            console.log(`  ❌ Error parseando tsconfig.json: ${message}`);
            return false;
        }
        
        const tsconfig = parsed.config;
        
        if (tsconfig.compilerOptions) {
            console.log('  ✅ tsconfig.json válido');
            return true;
        } else {
            console.log('  ❌ tsconfig.json malformado');
            return false;
        }
    } catch (error) {
        console.log(`  ❌ Error con tsconfig.json: ${error.message}`);
        return false;
    }
}

function generateDeploymentReport(results) {
    console.log('\n📊 REPORTE DE DESPLIEGUE\n');
    console.log('='.repeat(40));
    
    Object.entries(results).forEach(([check, passed]) => {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${check.padEnd(25)} : ${status}`);
    });
    
    console.log('='.repeat(40));
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 ¡LISTO PARA PRODUCCIÓN!');
        console.log('👍 Todas las verificaciones pasaron exitosamente.');
        console.log('🚀 Puedes proceder con el despliegue.');
    } else {
        console.log('\n⚠️  NO LISTO PARA PRODUCCIÓN');
        console.log('🔧 Resuelve los problemas marcados antes de desplegar.');
        console.log('📖 Consulta DEVELOPMENT.md para troubleshooting.');
    }
    
    return allPassed;
}

async function main() {
    try {
        const results = {
            'Variables de entorno': checkEnvironmentVariables(),
            'Archivos críticos': checkCriticalFiles(),
            'Package.json': checkPackageJson(),
            'TypeScript config': checkTypeScriptConfig(),
            'WhatsApp API': await checkWhatsAppConnectivity()
        };
        
        const readyForDeploy = generateDeploymentReport(results);
        
        // Exit code para CI/CD
        process.exit(readyForDeploy ? 0 : 1);
        
    } catch (error) {
        console.error('\n❌ Error durante verificaciones:', error.message);
        process.exit(1);
    }
}

// Exportar para tests
module.exports = { main, checkEnvironmentVariables, checkCriticalFiles };

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}
