#!/usr/bin/env node

/**
 * HEALTH CHECK - ASHLAR HOUSE
 * Script básico de verificación del sistema
 */

const path = require('path');
const fs = require('fs');

console.log('🔍 HEALTH CHECK - Ashlar House System');
console.log('='.repeat(50));
console.log(`📅 ${new Date().toLocaleString('es-MX')}\n`);

// Verificar archivos críticos
const criticalFiles = [
    'package.json',
    'src/index.ts',
    'config/database.ts',
    'config/server.ts'
];

console.log('1️⃣ VERIFICACIÓN DE ARCHIVOS CRÍTICOS:');
criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const exists = fs.existsSync(filePath);
    console.log(`   ${file}: ${exists ? '✅ Existe' : '❌ No encontrado'}`);
});

// Verificar variables de entorno críticas
console.log('\n2️⃣ VARIABLES DE ENTORNO CRÍTICAS:');
const envVars = [
    'NODE_ENV',
    'DATABASE_CLIENT',
    'HOST',
    'PORT'
];

envVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`   ${varName}: ${value ? '✅ Configurada' : '❌ No configurada'}`);
});

// Verificar dependencias críticas
console.log('\n3️⃣ DEPENDENCIAS CRÍTICAS:');
try {
    const packageJson = require('../package.json');
    const criticalDeps = [
        '@strapi/strapi',
        'pg',
        'dotenv'
    ];
    
    criticalDeps.forEach(dep => {
        const hasDepInDeps = packageJson.dependencies && packageJson.dependencies[dep];
        const hasDepInDevDeps = packageJson.devDependencies && packageJson.devDependencies[dep];
        const exists = hasDepInDeps || hasDepInDevDeps;
        console.log(`   ${dep}: ${exists ? '✅ Instalada' : '❌ No encontrada'}`);
    });
} catch (err) {
    console.log('   ❌ Error leyendo package.json');
}

console.log('\n✅ Health check completado');
console.log('📝 Para verificaciones más detalladas usa: npm run check:strapi');
