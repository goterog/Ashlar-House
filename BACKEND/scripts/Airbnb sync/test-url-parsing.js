// test-url-parsing.js
// Script específico para probar la extracción mejorada de URLs
console.log('🧪 TESTING URL PARSING MEJORADO');
console.log('================================\n');

// Simular el contenido real que viene del iCal
const testDescriptions = [
  // Caso 1: URL dividida en múltiples líneas (como viene de Airbnb)
  'Reservation URL: https://www.airbnb.com/hosting/reservations/details/HMFYXJ2ZTZ\\nPhone Number (Last 4 Digits): 8679',
  
  // Caso 2: URL dividida diferente
  'Reservation URL: https://www.airbnb.com/hosting/reservations/de tails/HMFYXJ2ZTZ\\nPhone Number (Last 4 Digits): 8679',
  
  // Caso 3: Solo texto sin URL completa
  'Reservation URL',
  
  // Caso 4: URL con diferentes caracteres de escape
  'Reservation URL: https://www.airbnb.com/hosting/reservations/details/ABC123\\r\\nOther info here'
];

// Función mejorada para extraer URL de reservación
function extractReservationURL(description) {
  if (!description) return '';
  
  console.log('📝 Description original:', JSON.stringify(description));
  
  // Limpiar caracteres de escape comunes primero
  let cleanDescription = description.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
  console.log('🧹 Description limpia:', JSON.stringify(cleanDescription));
  
  // Buscar el patrón "Reservation URL:" seguido de la URL
  const urlMatch = cleanDescription.match(/Reservation URL:\s*(https?:\/\/[^\s\n\r\\]+)/i);
  console.log('🔍 Pattern (Reservation URL):');
  console.log('   Match:', urlMatch ? 'SÍ' : 'NO');
  
  if (urlMatch) {
    let url = urlMatch[1];
    console.log('🔍 URL match encontrada:', url);
    
    // Limpiar caracteres no válidos al final de la URL
    url = url.replace(/[.,;!?\s\r\n\\]+$/, ''); // Remover puntuación, espacios y escapes al final
    
    // Cambiar .com por .mx si es necesario para que sea consistente
    url = url.replace('airbnb.com', 'airbnb.mx');
    
    console.log('✅ URL limpia:', url);
    return url;
  }
  
  // Buscar cualquier URL que contenga airbnb como fallback
  const airbnbMatch = cleanDescription.match(/(https?:\/\/[^\s\n\r\\]*airbnb[^\s\n\r\\]*)/i);
  console.log('🔍 Pattern (Airbnb URL):', airbnbMatch ? 'MATCH' : 'NO MATCH');
  
  if (airbnbMatch) {
    let url = airbnbMatch[1];
    url = url.replace(/[.,;!?\s\r\n\\]+$/, '');
    url = url.replace('airbnb.com', 'airbnb.mx');
    console.log('✅ URL Airbnb encontrada:', url);
    return url;
  }
  
  console.log('❌ No se encontró URL en description');
  return cleanDescription.replace(/\\n.*$/, '').trim(); // Fallback limpio
}

// Probar cada caso
testDescriptions.forEach((desc, index) => {
  console.log(`\n🔍 CASO DE PRUEBA ${index + 1}:`);
  console.log('=' .repeat(30));
  
  const result = extractReservationURL(desc);
  
  console.log('🎯 RESULTADO FINAL:', result);
  
  // Validar si es una URL válida
  const isValidUrl = result.startsWith('http') && result.includes('airbnb') && result.includes('reservations');
  console.log('✅ URL válida:', isValidUrl ? 'SÍ' : 'NO');
});

console.log('\n\n🎉 PRUEBAS COMPLETADAS');
console.log('======================');
console.log('💡 Si los casos 1 y 2 muestran URLs válidas, el parsing está funcionando correctamente');
