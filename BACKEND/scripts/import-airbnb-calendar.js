// import-airbnb-calendar.js
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337/api/bookings';
const AIRBNB_ICS_URL = 'https://www.airbnb.mx/calendar/ical/807381707673543946.ics?s=9789cc909449839e93a1202f822e9c8d';

// Convierte YYYYMMDD a YYYY-MM-DD (ISO)
function formatDateISO(yyyymmdd) {
  const year = yyyymmdd.substring(0, 4);
  const month = yyyymmdd.substring(4, 6);
  const day = yyyymmdd.substring(6, 8);
  return `${year}-${month}-${day}`;
}

function mapEstado(summary) {
  if (!summary) return 'Reservado';
  if (summary.toLowerCase().includes('reserved')) return 'Reservado';
  if (summary.toLowerCase().includes('not available')) return 'Bloqueado';
  return 'Disponible';
}

async function bookingExists(uid) {
  try {
    const res = await axios.get(`${STRAPI_URL}?filters[UID][$eq]=${encodeURIComponent(uid)}`);
    return res.data && res.data.data && res.data.data.length > 0;
  } catch (err) {
    console.error('Error buscando UID:', uid, err.message);
    return false;
  }
}

async function importICS() {
  // Descarga el .ics directamente de Airbnb
  const response = await axios.get(AIRBNB_ICS_URL);
  const ics = response.data;
  const events = ics.split('BEGIN:VEVENT').slice(1);

  for (const eventRaw of events) {
    const lines = eventRaw.split('\n').map(l => l.trim());
    let start, end, summary, description, uid;

    for (const line of lines) {
      if (line.startsWith('DTSTART')) start = line.split(':')[1];
      if (line.startsWith('DTEND')) end = line.split(':')[1];
      if (line.startsWith('SUMMARY')) summary = line.split(':')[1];
      if (line.startsWith('DESCRIPTION')) description = line.split(':')[1];
      if (line.startsWith('UID')) uid = line.split(':')[1];
    }

    if (!start || !end || !summary || !uid) continue;

    // Checa si ya existe el booking con ese UID
    const exists = await bookingExists(uid);
    if (exists) {
      console.log(`Booking con UID ${uid} ya existe, omitido.`);
      continue;
    }

    // Formatea fechas a ISO
    const startDate = formatDateISO(start);
    const endDate = formatDateISO(end);

    const booking = {
      title: summary,
      start: startDate,
      end: endDate,
      estado: mapEstado(summary),
      source: 'Airbnb',
      guest: '',
      name: '',
      email: '',
      phone: '',
      message: description || '',
      UID: uid,
    };

    try {
      const res = await axios.post(STRAPI_URL, { data: booking });
      console.log('Importado:', booking.title, booking.start, '-', booking.end);
    } catch (err) {
      console.error('Error importando:', booking, err.response?.data || err.message);
    }
  }
}

importICS();