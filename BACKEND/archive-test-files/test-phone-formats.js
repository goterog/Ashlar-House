/**
 * Test de diferentes formatos de número para CallMeBot
 */

require('dotenv').config();

async function testPhoneFormats() {
  console.log('📞 TEST DE FORMATOS DE NÚMERO');
  console.log('==============================\n');
  
  const apiKey = process.env.CALLMEBOT_API_KEY_1;
  const baseMessage = 'Test formato - ' + new Date().toLocaleTimeString();
  
  const phoneFormats = [
    { format: 'Sin +', number: '5218119936655' },
    { format: 'Con +', number: '+5218119936655' },
    { format: 'Con espacios', number: '521 811 993 6655' },
    { format: 'Con guiones', number: '521-811-993-6655' }
  ];
  
  if (!apiKey) {
    console.log('❌ API Key no configurada');
    return;
  }
  
  console.log(`🔑 API Key: ${apiKey}`);
  console.log('📱 Probando diferentes formatos de número...\n');
  
  let fetch;
  try {
    fetch = globalThis.fetch || (await import('node-fetch')).default;
  } catch (e) {
    console.log('❌ Error importando fetch');
    return;
  }
  
  for (const phoneTest of phoneFormats) {
    console.log(`🧪 Probando: ${phoneTest.format} (${phoneTest.number})`);
    
    try {
      const cleanNumber = phoneTest.number.replace(/[-\s+]/g, '');
      const message = `${baseMessage} - ${phoneTest.format}`;
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanNumber}&text=${encodedMessage}&apikey=${apiKey}`;
      
      console.log(`   🔗 URL: ...phone=${cleanNumber}&text=${message.substring(0, 20)}...`);
      
      const response = await fetch(url, { timeout: 10000 });
      const responseText = await response.text();
      
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   📄 Response: ${responseText}`);
      
      if (response.status === 200 && responseText.toLowerCase().includes('sent')) {
        console.log(`   ✅ ¡ÉXITO con formato: ${phoneTest.format}!`);
        console.log(`   📲 Deberías recibir: "${message}"`);
        break; // Si funciona uno, no probar los demás
      } else {
        console.log(`   ❌ Falló con formato: ${phoneTest.format}`);
      }
      
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`);
    }
    
    console.log();
    
    // Pausa entre pruebas para no saturar
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🏁 Test de formatos completado');
  console.log('💡 Si ningún formato funcionó, el problema puede ser:');
  console.log('   • API Key incorrecta');
  console.log('   • Número no registrado correctamente');
  console.log('   • Problemas temporales de CallMeBot');
}

testPhoneFormats().catch(console.error);
