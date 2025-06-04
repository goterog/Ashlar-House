const https = require('https');

async function testSingleMessage(phoneNumber, apiKey, testName) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Prueba: ${testName}`);
    console.log(`📱 Número: ${phoneNumber}`);
    console.log(`🔑 API Key: ${apiKey}`);
    
    const message = `Prueba ASHLAR HOUSE - ${new Date().toLocaleTimeString('es-ES')}`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
    
    console.log(`📝 Mensaje: ${message}`);
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📄 Response: ${data}`);
        if (res.statusCode === 200) {
          console.log(`✅ ${testName} - ÉXITO`);
          resolve(true);
        } else {
          console.log(`❌ ${testName} - FALLÓ`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${testName} - ERROR: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      req.abort();
      console.log(`❌ ${testName} - TIMEOUT`);
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('🚀 Prueba rápida de ambas API keys\n');
  
  const test1 = await testSingleMessage('+5218119936655', '4639929', 'API Key 1');
  await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
  
  const test2 = await testSingleMessage('+5218111755533', '1855584', 'API Key 2');
  
  console.log('\n' + '='.repeat(50));
  console.log(`🎯 Resultados:`);
  console.log(`   API Key 1 (+5218119936655): ${test1 ? '✅ ÉXITO' : '❌ FALLÓ'}`);
  console.log(`   API Key 2 (+5218111755533): ${test2 ? '✅ ÉXITO' : '❌ FALLÓ'}`);
  console.log('='.repeat(50));
}

runTests().catch(console.error);
