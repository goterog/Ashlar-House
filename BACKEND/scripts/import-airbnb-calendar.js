const ical = require('node-ical');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// URL de tu .ics de Airbnb (puedes actualizarlo aquí)
const AIRBNB_ICS_URL = 'https://www.airbnb.mx/calendar/ical/807381707673543946.ics?s=9789cc909449839e93a1202f822e9c8d';

// Endpoint de tu API Strapi
const STRAPI_API = 'http://localhost:1337/api/calendars';

// Limpia y normaliza fechas a formato YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function importAirbnbCalendar() {
  // 1. Descarga el .ics de Airbnb
  const res = await fetch(AIRBNB_ICS_URL);
  const icsData = await res.text();

  // 2. Parsea el .ics
  const events = ical.parseICS(icsData);

  for (const k in events) {
    const ev = events[k];
    if (ev.type === 'VEVENT') {
      // 3. Crea el evento en Strapi
      const body = {
        data: {
          title: ev.summary || 'Reservado',
          start: formatDate(ev.start),
          end: formatDate(ev.end),
          estado: 'Reservado',
          source: 'Airbnb',
          guests: null,
          name: '',
          email: '',
          phone: null,
          message: ev.description || ''
        }
      };
      // Puedes agregar más campos si lo deseas

      // 4. (Opcional) Elimina duplicados antes de crear (por UID)
      // Aquí podrías hacer un fetch a Strapi para buscar por UID y evitar duplicados

      // 5. Crea el evento
      const response = await fetch(STRAPI_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      console.log('POST result:', result);
    }
  }
  console.log('Importación completada');
}

importAirbnbCalendar();