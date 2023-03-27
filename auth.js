const dotenv = require('dotenv');
dotenv.config();

const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  access_token: process.env.accessToken,
  refresh_token: process.env.refreshToken
});

const gmail = google.gmail({version: 'v1', auth: oauth2Client});

module.exports = { gmail };
