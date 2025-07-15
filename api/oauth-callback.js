const { google } = require('googleapis');

module.exports = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const code = req.query.code;

  if (!code) {
    console.error('❌ No se recibió ningún "code" en la query');
    return res.status(400).send('❌ No se recibió ningún "code" en la query');
  }

  try {
    console.log('✅ Intentando obtener tokens con code:', code);

    const { tokens } = await oauth2Client.getToken(code);
    console.log('✅ Tokens recibidos:', tokens);

    oauth2Client.setCredentials(tokens);

    res.status(200).send('✅ ¡Autenticación exitosa! Ya puedes usar /api/calendar-events');
  } catch (error) {
    console.error('❌ Error al obtener el token:', error.response ? error.response.data : error.message);
    res.status(500).send('❌ Error al obtener el token');
  }
};
