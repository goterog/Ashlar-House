// test-airbnb-sync.js
// Script para probar la nueva sincronización automática con Airbnb
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337/api/bookings';
const AIRBNB_ICS_URL = 'https://www.airbnb.mx/calendar/ical/807381707673543946.ics?s=9789cc909449839e93a1202f822e9c8d';

// Función mejorada para extraer URL de reservación
function extractReservationURL(description) {
  if (!description) return '';
  
  console.log('📝 Description original:', description);
  
  // Limpiar caracteres de escape comunes primero
  let cleanDescription = description.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
  console.log('🧹 Description limpia:', cleanDescription);
  
  // Buscar el patrón "Reservation URL:" seguido de la URL
  const urlMatch = cleanDescription.match(/Reservation URL:\s*(https?:\/\/[^\s\n\r\\]+)/i);
  console.log('🔍 Pattern 1 (Reservation URL):');
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
  console.log('🔍 Pattern 2 (Airbnb URL):', airbnbMatch ? 'MATCH' : 'NO MATCH');
  
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

async function testURLExtraction() {
  console.log('🧪 TESTING URL EXTRACTION FROM AIRBNB CALENDAR');
  console.log('===============================================\n');

  try {
    // Descarga el .ics directamente de Airbnb
    console.log('📥 Descargando calendario de Airbnb...');
    const response = await axios.get(AIRBNB_ICS_URL);
    const ics = response.data;
    const events = ics.split('BEGIN:VEVENT').slice(1);

    console.log(`📊 Encontrados ${events.length} eventos en el calendario\n`);

    // Procesar solo los primeros 3 eventos para testing
    const eventsToTest = events.slice(0, 3);    for (let i = 0; i < eventsToTest.length; i++) {
      const eventRaw = eventsToTest[i];
      console.log(`\n🔍 EVENTO ${i + 1}:`);
      console.log('=' .repeat(30));
        // Mejorar el parsing para manejar líneas continuadas
      const rawLines = eventRaw.split('\n');
      let start, end, summary, description, uid;

      // Reconstituir líneas que pueden estar divididas
      const reconstructedLines = [];
      let currentLine = '';
      
      for (const line of rawLines) {
        // En iCal, las líneas continuadas empiezan con espacio o tab
        if ((line.startsWith(' ') || line.startsWith('\t')) && currentLine) {
          // Línea continuada (iCal fold) - remover el espacio/tab inicial
          currentLine += line.substring(1);
        } else {
          if (currentLine) reconstructedLines.push(currentLine.trim());
          currentLine = line.trim();
        }
      }
      if (currentLine) reconstructedLines.push(currentLine.trim());

      console.log('📝 RAW LINES DEBUG:');
      reconstructedLines.forEach((line, idx) => {
        if (line.includes('DESCRIPTION') || line.includes('Reservation')) {
          console.log(`  Line ${idx}: "${line}"`);
        }
      });

      for (const line of reconstructedLines) {
        if (line.startsWith('DTSTART')) start = line.split(':')[1];
        if (line.startsWith('DTEND')) end = line.split(':')[1];
        if (line.startsWith('SUMMARY')) summary = line.split(':')[1];
        if (line.startsWith('DESCRIPTION')) {
          description = line.substring(line.indexOf(':') + 1);
        }
        if (line.startsWith('UID')) uid = line.split(':')[1];
      }

      console.log('📋 Summary:', summary);
      console.log('📅 Start:', start);
      console.log('📅 End:', end);
      console.log('🆔 UID:', uid);
      console.log('\n📝 Description RAW:');
      console.log(description);
      
      console.log('\n🔧 Procesando URL...');
      const extractedURL = extractReservationURL(description || '');
      console.log('🎯 URL Final:', extractedURL);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testStrapiConnection() {
  console.log('\n\n🔌 TESTING STRAPI CONNECTION');
  console.log('============================');

  try {
    const response = await axios.get(STRAPI_URL);
    console.log('✅ Strapi conectado correctamente');
    console.log('📊 Bookings existentes:', response.data.data?.length || 0);
  } catch (error) {
    console.error('❌ Error conectando a Strapi:', error.message);
    console.log('💡 Asegúrate de que Strapi esté ejecutándose en http://localhost:1337');
  }
}

// Ejecutar tests
async function runTests() {
  await testURLExtraction();
  await testStrapiConnection();
  
  console.log('\n\n🎉 TESTING COMPLETADO');
  console.log('====================');
  console.log('💡 Si todo se ve bien, la sincronización automática funcionará correctamente');
  console.log('⏰ El cron job se ejecutará cada 3 horas cuando Strapi esté funcionando');
}

runTests();
