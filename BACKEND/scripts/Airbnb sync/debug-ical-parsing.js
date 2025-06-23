// debug-ical-parsing.js
// Script específico para debuggear el parsing de iCal y URLs truncadas
const axios = require('axios');

const AIRBNB_ICS_URL = 'https://www.airbnb.mx/calendar/ical/807381707673543946.ics?s=9789cc909449839e93a1202f822e9c8d';

// Función mejorada para extraer URL de reservación (igual a la del sistema principal)
function extractReservationURL(description) {
  if (!description) return '';
  
  // Limpiar caracteres de escape comunes
  let cleanDescription = description.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
  
  // Buscar diferentes patrones de URL
  const patterns = [
    /Reservation URL:\s*(https?:\/\/[^\s\n\r\\]+)/i,
    /URL:\s*(https?:\/\/[^\s\n\r\\]+)/i,
    /(https?:\/\/[^\s\n\r\\]*airbnb[^\s\n\r\\]*)/i,
    /(https?:\/\/[^\s\n\r\\]+)/i // Patrón genérico para cualquier URL
  ];
  
  for (const pattern of patterns) {
    const urlMatch = cleanDescription.match(pattern);
    if (urlMatch) {
      let url = urlMatch[1];
      // Limpiar caracteres no válidos al final de la URL
      url = url.replace(/[.,;!?\s\r\n\\]+$/, ''); // Remover puntuación y espacios al final
      // Cambiar .com por .mx si es necesario para que sea consistente
      url = url.replace('airbnb.com', 'airbnb.mx');
      return url;
    }
  }
  
  // Si no se encuentra URL, devolver la descripción completa limpia
  return cleanDescription.trim();
}

async function debugICalParsing() {
  console.log('🔍 DEBUG COMPLETO DEL PARSING iCAL');
  console.log('===================================\n');

  try {
    // Descarga el .ics directamente de Airbnb
    console.log('📥 Descargando calendario de Airbnb...');
    const response = await axios.get(AIRBNB_ICS_URL);
    const ics = response.data;
    
    console.log('📄 CONTENIDO COMPLETO DEL ARCHIVO .ics:');
    console.log('=' .repeat(50));
    console.log(ics);
    console.log('=' .repeat(50));
    
    const events = ics.split('BEGIN:VEVENT').slice(1);
    console.log(`\n📊 Encontrados ${events.length} eventos\n`);

    // Analizar el primer evento que tenga reserva
    for (let i = 0; i < events.length; i++) {
      const eventRaw = events[i];
      
      if (!eventRaw.includes('Reserved')) continue;
      
      console.log(`🔍 ANALIZANDO EVENTO CON RESERVA #${i + 1}:`);
      console.log('=' .repeat(40));
      
      console.log('\n📝 EVENTO RAW (con saltos de línea visibles):');
      console.log(eventRaw.replace(/\n/g, '\\n\n').replace(/\r/g, '\\r'));
      
      console.log('\n📋 LÍNEAS INDIVIDUALES:');
      const rawLines = eventRaw.split('\n');
      rawLines.forEach((line, idx) => {
        console.log(`  ${idx.toString().padStart(2)}: "${line}"`);
      });
      
      console.log('\n🔧 APLICANDO FOLDING DE iCAL:');
      const lines = eventRaw.split('\n');
      const unfoldedLines = [];
      let currentLine = '';
      
      for (const line of lines) {
        if (line.startsWith(' ') || line.startsWith('\t')) {
          // Línea continuada
          console.log(`   📎 Continuando línea: "${line}"`);
          currentLine += line.substring(1); // Remover el espacio/tab inicial
        } else {
          if (currentLine) {
            unfoldedLines.push(currentLine);
            console.log(`   ✅ Línea completa: "${currentLine}"`);
          }
          currentLine = line.trim();
        }
      }
      if (currentLine) {
        unfoldedLines.push(currentLine);
        console.log(`   ✅ Línea final: "${currentLine}"`);
      }
      
      console.log('\n📋 LÍNEAS DESPUÉS DEL UNFOLDING:');
      unfoldedLines.forEach((line, idx) => {
        console.log(`  ${idx.toString().padStart(2)}: "${line}"`);
        if (line.includes('DESCRIPTION')) {
          console.log(`      👆 DESCRIPTION encontrada!`);
        }
      });
      
      // Extraer description específicamente
      const descriptionLine = unfoldedLines.find(line => line.startsWith('DESCRIPTION:'));
      if (descriptionLine) {
        const description = descriptionLine.substring(12); // Remover "DESCRIPTION:"
        console.log('\n🎯 DESCRIPTION EXTRAÍDA:');
        console.log(`"${description}"`);
          // Probar extracción de URL usando la función mejorada
        console.log('\n🔗 EXTRAYENDO URL CON FUNCIÓN MEJORADA:');
        const extractedURL = extractReservationURL(description);
        console.log(`🎯 URL extraída: "${extractedURL}"`);
        
        // Debug adicional
        console.log('\n🔍 DEBUG REGEX:');
        const cleanDescription = description.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
        console.log(`Description limpia: "${cleanDescription}"`);
        
        const patterns = [
          /Reservation URL:\s*(https?:\/\/[^\s\n\r\\]+)/i,
          /URL:\s*(https?:\/\/[^\s\n\r\\]+)/i,
          /(https?:\/\/[^\s\n\r\\]*airbnb[^\s\n\r\\]*)/i,
          /(https?:\/\/[^\s\n\r\\]+)/i
        ];
        
        patterns.forEach((pattern, i) => {
          const match = cleanDescription.match(pattern);
          console.log(`Pattern ${i + 1}: ${match ? `MATCH: "${match[1]}"` : 'NO MATCH'}`);
        });
      }
      
      break; // Solo analizar el primer evento con reserva
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugICalParsing();
