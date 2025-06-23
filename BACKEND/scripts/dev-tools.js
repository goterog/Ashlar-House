#!/usr/bin/env node

/**
 * 🎯 Script Maestro - Ashlar House Development Tools
 * Herramienta unificada para todas las tareas de desarrollo
 * 
 * Uso: node scripts/dev-tools.js [comando]
 * 
 * Comandos disponibles:
 * - health-check  : Verificación completa del sistema
 * - test-whatsapp : Test rápido de WhatsApp API
 * - check-strapi  : Verificar conectividad Strapi
 * - demo         : Enviar mensaje de demostración
 * - help         : Mostrar esta ayuda
 */

const COMMANDS = {
    'health-check': {
        description: 'Verificación completa del sistema',
        file: './health-check.js'
    },    'test-whatsapp': {
        description: 'Test rápido de WhatsApp API',
        file: './Whatsapp vía callmebot/whatsapp-test-complete.js',
        args: ['demo']
    },
    'check-strapi': {
        description: 'Verificar conectividad Strapi',
        file: './check-strapi.js'
    },    'simulate': {
        description: 'Simular lifecycle hooks',
        file: './Whatsapp vía callmebot/whatsapp-test-complete.js',
        args: ['simulate']
    }
};

function showHelp() {
    console.log('🎯 Ashlar House - Herramientas de Desarrollo\n');
    console.log('📋 Comandos disponibles:\n');
    
    Object.entries(COMMANDS).forEach(([cmd, info]) => {
        console.log(`  ${cmd.padEnd(15)} - ${info.description}`);
    });
    
    console.log('\n💡 Ejemplos de uso:');
    console.log('  node scripts/dev-tools.js health-check');
    console.log('  node scripts/dev-tools.js test-whatsapp');
    console.log('  node scripts/dev-tools.js check-strapi');
    console.log('\n📖 Para más información, consulta DEVELOPMENT.md');
}

async function runCommand(command) {
    const cmd = COMMANDS[command];
    if (!cmd) {
        console.log(`❌ Comando desconocido: ${command}`);
        console.log('💡 Usa "help" para ver comandos disponibles');
        return;
    }

    try {
        console.log(`🚀 Ejecutando: ${cmd.description}\n`);
          // Para scripts con argumentos específicos
        if (cmd.args) {
            const { spawn } = require('child_process');
            const path = require('path');
            const scriptPath = path.join(__dirname, cmd.file);
            const child = spawn('node', [scriptPath, ...cmd.args], { stdio: 'inherit' });
            
            return new Promise((resolve, reject) => {
                child.on('close', (code) => {
                    if (code !== 0) {
                        console.log(`\n❌ El comando terminó con código: ${code}`);
                        reject(new Error(`Command failed with code ${code}`));
                    } else {
                        resolve();
                    }
                });
                
                child.on('error', (error) => {
                    reject(error);
                });
            });
        }
        
        // Para scripts regulares
        // Importar y ejecutar el script
        const scriptModule = require(cmd.file);
        
        // Si el script exporta una función, ejecutarla
        if (typeof scriptModule === 'function') {
            await scriptModule();
        } else if (typeof scriptModule.main === 'function') {
            await scriptModule.main();
        } else {
            // Si es un script standalone, ejecutarlo con spawn
            const { spawn } = require('child_process');
            const child = spawn('node', [cmd.file], { stdio: 'inherit' });
            
            child.on('close', (code) => {
                if (code !== 0) {
                    console.log(`\n❌ El comando terminó con código: ${code}`);
                }
            });
        }
        
    } catch (error) {
        console.error(`❌ Error ejecutando ${command}:`, error.message);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (!command || command === 'help') {
        showHelp();
        return;
    }
    
    await runCommand(command);
}

// Exportar para uso como módulo
module.exports = { main, runCommand, showHelp };

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}
