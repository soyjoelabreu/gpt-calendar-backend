const { google } = require('googleapis');

module.exports = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.status(200).send('✅ ¡Autenticación exitosa! Ya puedes usar /api/calendar-events');
  } catch (error) {
    console.error('❌ Error al obtener el token', error);
    res.status(500).send('❌ Error al obtener el token');
  }
};
