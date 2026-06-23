#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envDevelopmentPath = path.join(process.cwd(), '.env.development');

if (!fs.existsSync(envPath) && fs.existsSync(envDevelopmentPath)) {
  fs.copyFileSync(envDevelopmentPath, envPath);
  console.log('📄 .env creado desde .env.development');
  process.exit(0);
}

if (!fs.existsSync(envPath)) {
  console.error('❌ No existe .env ni .env.development');
  process.exit(1);
}

console.log('✅ .env encontrado');
