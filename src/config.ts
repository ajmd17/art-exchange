import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../', (process.env.NODE_ENV || 'development') + '.env') });

const config = {
  DB_NAME: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',

  DB_CONNECT_URL: '',

  JWT_TOKEN_SECRET: '',

  TWILIO_SID: '',
  TWILIO_AUTH_TOKEN: '',
  // SSL_CA: 'bidsquid_ca.ca-bundle',
  // SSL_KEY: 'private-key.pem',
  // SSL_CERT: 'bidsquid_ca.crt',

  PORT: process.env.NODE_ENV == 'production'
    ? 8081
    : 9001,

  MAILER_ADDRESS: '',
  MAILER_PASSWORD: ''
};

const getEnvVar = (name) => {
  if (!process.env[name]) throw new Error(`${name} environment variable not configured`);
  return process.env[name];
};

const setFromEnvVar = (name) => {
  config[name] = getEnvVar(name);
};

[
  'DB_NAME',
  'JWT_TOKEN_SECRET',
  'MAILER_ADDRESS',
  'MAILER_PASSWORD',
  'TWILIO_SID',
  'TWILIO_AUTH_TOKEN'
].forEach(setFromEnvVar);

if (process.env.NODE_ENV === 'production') {
  [
    'DB_USERNAME',
    'DB_PASSWORD'
  ].forEach(setFromEnvVar);
  config.DB_CONNECT_URL = `mongodb://${config.DB_USERNAME}:${config.DB_PASSWORD}@localhost/${config.DB_NAME}`
} else if ((process.env.NODE_ENV || 'development') === 'development') {
  config.DB_CONNECT_URL = `mongodb://localhost/${config.DB_NAME}`;
} else {
  throw new Error('Cannot set DB_CONNECT_URL, unknown development environment');
}

export default config;