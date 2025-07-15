
const { google } = require('googleapis');

let accessToken = null;

module.exports = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  if (!accessToken) {
    return res.status(401).send('❌ No autenticado. Primero ve a /api/oauth-callback');
  }

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
    res.status(200).json(response.data.items);
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error al obtener eventos');
  }
};
