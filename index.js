
const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

let accessToken = null;

app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

app.get('/login', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

app.get('/oauth/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    accessToken = tokens.access_token;
    res.send('✅ ¡Autenticación exitosa! Ya puedes usar /calendar/events');
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error al obtener el token');
  }
});

app.get('/calendar/events', async (req, res) => {
  if (!accessToken) return res.status(401).send('❌ No autenticado');

  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    res.json(response.data.items);
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error al obtener eventos');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
