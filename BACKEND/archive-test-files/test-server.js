/**
 * Servidor de prueba para simular la creación de reservas
 * y probar el sistema WhatsApp
 */

const http = require('http');
const url = require('url');
require('dotenv').config();

// Mock de strapi
global.strapi = {
  log: {
    info: (...args) => console.log('📘 [INFO]', ...args),
    error: (...args) => console.log('❌ [ERROR]', ...args),
    warn: (...args) => console.log('⚠️  [WARN]', ...args)
  }
};

// Cargar el lifecycle
const lifecycle = require('../src/api/booking/content-types/booking/lifecycles.js');

// Crear servidor
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/test-booking' && req.method === 'POST') {
    console.log('\n🎯 Nueva prueba de booking recibida');
    
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('📝 Datos recibidos:', data);
        
        // Crear booking de prueba
        const testBooking = {
          id: Date.now(),
          estado: data.estado || 'Reservado',
          start: data.start || new Date().toISOString(),
          end: data.end || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          source: data.source || 'Test',
          name: data.name || 'Cliente de Prueba',
          guest: data.guest || 2,
          phone: data.phone || '+52-81-1234-5678',
          email: data.email || 'test@ashlarhouse.com',
          message: data.message || 'Reserva de prueba del sistema'
        };
        
        console.log('\n🚀 Ejecutando lifecycle hook...');
        
        // Simular el evento de Strapi
        const event = { result: testBooking };
        
        // Ejecutar el lifecycle
        await lifecycle.afterCreate(event);
        
        console.log('\n✅ Lifecycle ejecutado exitosamente');
        
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          booking: testBooking,
          message: 'Reserva creada y notificaciones enviadas'
        }));
        
      } catch (error) {
        console.log('\n❌ Error:', error.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    
  } else if (parsedUrl.pathname === '/' && req.method === 'GET') {
    // Página de prueba
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>🏠 Ashlar House - Test WhatsApp</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .form-group { margin: 15px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        button { background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background: #45a049; }
        .result { margin-top: 20px; padding: 15px; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <h1>🏠 Ashlar House - Test del Sistema WhatsApp</h1>
    <p>Usa este formulario para probar el sistema de notificaciones WhatsApp:</p>
    
    <form id="testForm">
        <div class="form-group">
            <label>Estado:</label>
            <select name="estado" required>
                <option value="Reservado">Reservado</option>
                <option value="Bloqueado">Bloqueado</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Fecha de inicio:</label>
            <input type="date" name="start" required>
        </div>
        
        <div class="form-group">
            <label>Fecha de fin:</label>
            <input type="date" name="end" required>
        </div>
        
        <div class="form-group">
            <label>Fuente:</label>
            <input type="text" name="source" value="Test Manual">
        </div>
        
        <div class="form-group">
            <label>Nombre del cliente:</label>
            <input type="text" name="name" value="Cliente de Prueba">
        </div>
        
        <div class="form-group">
            <label>Número de huéspedes:</label>
            <input type="number" name="guest" value="2" min="1">
        </div>
        
        <div class="form-group">
            <label>Teléfono:</label>
            <input type="tel" name="phone" value="+52-81-1234-5678">
        </div>
        
        <div class="form-group">
            <label>Email:</label>
            <input type="email" name="email" value="test@ashlarhouse.com">
        </div>
        
        <div class="form-group">
            <label>Mensaje:</label>
            <textarea name="message">Reserva de prueba del sistema WhatsApp</textarea>
        </div>
        
        <button type="submit">🚀 Enviar Prueba de Reserva</button>
    </form>
    
    <div id="result"></div>
    
    <script>
        // Establecer fechas por defecto
        document.querySelector('input[name="start"]').value = new Date().toISOString().split('T')[0];
        document.querySelector('input[name="end"]').value = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
        
        document.getElementById('testForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>⏳ Enviando prueba...</p>';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/test-booking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = \`
                        <div class="result success">
                            <h3>✅ ¡Éxito!</h3>
                            <p>\${result.message}</p>
                            <p><strong>📱 Revisa WhatsApp en 1-3 minutos</strong></p>
                            <details>
                                <summary>Ver detalles de la reserva</summary>
                                <pre>\${JSON.stringify(result.booking, null, 2)}</pre>
                            </details>
                        </div>
                    \`;
                } else {
                    resultDiv.innerHTML = \`
                        <div class="result error">
                            <h3>❌ Error</h3>
                            <p>\${result.error}</p>
                        </div>
                    \`;
                }
            } catch (error) {
                resultDiv.innerHTML = \`
                    <div class="result error">
                        <h3>❌ Error de conexión</h3>
                        <p>\${error.message}</p>
                    </div>
                \`;
            }
        });
    </script>
</body>
</html>`;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('🚀 Servidor de prueba iniciado');
  console.log(`📱 Ve a: http://localhost:${PORT}`);
  console.log('🎯 Allí podrás probar el sistema WhatsApp');
  console.log('=====================================');
  console.log('📋 Configuración actual:');
  console.log(`   API Key 1: ${process.env.CALLMEBOT_API_KEY_1}`);
  console.log(`   API Key 2: ${process.env.CALLMEBOT_API_KEY_2}`);
  console.log('=====================================');
  console.log('Presiona Ctrl+C para detener el servidor');
});
