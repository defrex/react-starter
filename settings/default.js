
const settings = {};

settings.GOOGLE_ANALYICS_ACCOUNT = 'UA-XXXX-Y';

if (process.browser)
  settings.API_HOST = document.location.origin;
else
  settings.API_HOST = 'http://localhost:8000';

export default settings;
