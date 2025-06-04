#!/usr/bin/env node

/**
 * 🔧 Environment Setup Helper - Ashlar House
 * Ayuda a configurar variables de entorno para desarrollo y producción
 */

const fs = require('fs');
const path = require('path');

const ENV_TEMPLATE = `# Ashlar House - Environment Configuration
# Generated on ${new Date().toISOString()}

# ===== STRAPI CONFIGURATION =====
HOST=0.0.0.0
PORT=1337

# Security Keys (REGENERATE FOR PRODUCTION!)
APP_KEYS="strapi-key-1,strapi-key-2,strapi-key-3,strapi-key-4"
API_TOKEN_SALT="your-api-token-salt-here"
ADMIN_JWT_SECRET="your-admin-jwt-secret-here"
TRANSFER_TOKEN_SALT="your-transfer-token-salt-here"
JWT_SECRET="your-jwt-secret-here"

# ===== DATABASE CONFIGURATION =====
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# For PostgreSQL (Production):
# DATABASE_CLIENT=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=ashlar_house
# DATABASE_USERNAME=your_username
# DATABASE_PASSWORD=your_password
# DATABASE_SSL=false

# ===== WHATSAPP NOTIFICATIONS =====
# CallMeBot API Keys (Configure these with your actual keys)
CALLMEBOT_API_KEY_1=your-api-key-1-here    # Para +5218119936655
CALLMEBOT_API_KEY_2=your-api-key-2-here    # Para +5218111755533

# ===== DEVELOPMENT FLAGS =====
NODE_ENV=development
STRAPI_LOG_LEVEL=debug

# ===== OPTIONAL CONFIGURATIONS =====
# STRAPI_ADMIN_BACKEND_URL=http://localhost:1337
# STRAPI_ADMIN_CLIENT_URL=http://localhost:3000
# STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=your-preview-secret
`;

const PRODUCTION_NOTES = `
# 🚀 NOTAS PARA PRODUCCIÓN:

1. 🔐 SEGURIDAD CRÍTICA:
   - Regenera TODAS las claves secretas
   - Usa claves fuertes y únicas
   - Nunca subas el .env a git

2. 📱 WHATSAPP:
   - Configura CALLMEBOT_API_KEY_1 y CALLMEBOT_API_KEY_2
   - Verifica que los números estén registrados en CallMeBot

3. 🗄️  BASE DE DATOS:
   - Cambia a PostgreSQL para producción
   - Configura respaldos automáticos
   - Usa conexiones SSL

4. 🌐 SERVIDOR:
   - NODE_ENV=production
   - HOST=0.0.0.0 (para contenedores)
   - PORT=1337 o variable de entorno del proveedor

5. ✅ VERIFICACIÓN:
   - Ejecuta: npm run pre-deploy
   - Confirma que todos los checks pasen
`;

function generateSecretKey(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function createEnvFile(type = 'development') {
    const envPath = path.join(process.cwd(), '.env');
    const backupPath = path.join(process.cwd(), '.env.backup');
    
    // Backup existing .env if it exists
    if (fs.existsSync(envPath)) {
        console.log('📋 Respaldando .env existente...');
        fs.copyFileSync(envPath, backupPath);
        console.log(`✅ Respaldo creado: .env.backup`);
    }
    
    // Generate secure keys for production
    let content = ENV_TEMPLATE;
    if (type === 'production') {
        console.log('🔐 Generando claves seguras para producción...');
        const appKeys = Array.from({length: 4}, () => generateSecretKey()).join(',');
        content = content
            .replace('strapi-key-1,strapi-key-2,strapi-key-3,strapi-key-4', appKeys)
            .replace('your-api-token-salt-here', generateSecretKey())
            .replace('your-admin-jwt-secret-here', generateSecretKey())
            .replace('your-transfer-token-salt-here', generateSecretKey())
            .replace('your-jwt-secret-here', generateSecretKey())
            .replace('NODE_ENV=development', 'NODE_ENV=production')
            .replace('STRAPI_LOG_LEVEL=debug', 'STRAPI_LOG_LEVEL=info');
    }
    
    fs.writeFileSync(envPath, content);
    console.log(`✅ Archivo .env creado para ${type}`);
    
    if (type === 'production') {
        const notesPath = path.join(process.cwd(), 'PRODUCTION-NOTES.txt');
        fs.writeFileSync(notesPath, PRODUCTION_NOTES);
        console.log('📝 Archivo PRODUCTION-NOTES.txt creado');
    }
}

function checkCurrentEnv() {
    const envPath = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envPath)) {
        console.log('❌ No se encontró archivo .env');
        return false;
    }
    
    console.log('📋 Verificando configuración actual...\n');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
        'APP_KEYS',
        'API_TOKEN_SALT', 
        'ADMIN_JWT_SECRET',
        'JWT_SECRET',
        'CALLMEBOT_API_KEY_1',
        'CALLMEBOT_API_KEY_2'
    ];
    
    let allConfigured = true;
    
    requiredVars.forEach(varName => {
        const hasVar = envContent.includes(`${varName}=`) && 
                      !envContent.includes(`${varName}=your-`) &&
                      !envContent.includes(`${varName}=strapi-key-`);
        
        if (hasVar) {
            console.log(`  ✅ ${varName}`);
        } else {
            console.log(`  ❌ ${varName} - Necesita configuración`);
            allConfigured = false;
        }
    });
    
    return allConfigured;
}

function showHelp() {
    console.log('🔧 Environment Setup Helper - Ashlar House\n');
    console.log('📋 Comandos disponibles:\n');
    console.log('  check      - Verificar configuración actual');
    console.log('  dev        - Crear .env para desarrollo');
    console.log('  prod       - Crear .env para producción');
    console.log('  help       - Mostrar esta ayuda');
    console.log('\n💡 Ejemplos:');
    console.log('  node scripts/env-setup.js check');
    console.log('  node scripts/env-setup.js dev');
    console.log('  node scripts/env-setup.js prod');
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    console.log('🔧 Environment Setup Helper - Ashlar House\n');
    
    switch (command) {
        case 'check':
            const isConfigured = checkCurrentEnv();
            if (isConfigured) {
                console.log('\n🎉 ¡Configuración completa!');
            } else {
                console.log('\n⚠️  Configuración incompleta');
                console.log('💡 Usa "dev" o "prod" para generar configuración');
            }
            break;
            
        case 'dev':
            createEnvFile('development');
            console.log('\n📝 Siguiente paso: Configura las API keys de CallMeBot');
            console.log('💡 Usa "check" para verificar la configuración');
            break;
            
        case 'prod':
            createEnvFile('production');
            console.log('\n⚠️  IMPORTANTE: Lee PRODUCTION-NOTES.txt');
            console.log('🔐 Configura las API keys antes de desplegar');
            break;
            
        case 'help':
            showHelp();
            break;
            
        default:
            console.log('❌ Comando desconocido');
            showHelp();
            break;
    }
}

// Exportar para uso como módulo
module.exports = { main, createEnvFile, checkCurrentEnv };

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}
