
import * as express from 'express';
import * as ejs from 'ejs';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';

import routine from './routine';
import config from './config';

import * as mongoose from 'mongoose';
(<any>mongoose.Promise) = global.Promise;

import serverSideRenderer from './server-side-renderer';

import apiRouter from './routes/api';

// create main express app
const app = express();

function createServer() {
  // if (process.env.NODE_ENV == 'production') {
  //   const httpsConfig = {
  //     ca: fs.readFileSync(path.join(__dirname, `../../certs/${ServerConfig.SSL_CA}`)).toString(),
  //     key: fs.readFileSync(path.join(__dirname, `../../certs/${ServerConfig.SSL_KEY}`)).toString(),
  //     cert: fs.readFileSync(path.join(__dirname, `../../certs/${ServerConfig.SSL_CERT}`)).toString()
  //   };

  //   return https.createServer(httpsConfig, app);
  // } else {
    return http.createServer(app);
  // }
}

const server = createServer();

const assetsFolder = '../assets/';
const publicFolder = './public';

declare const DEPLOY_VERSION: number;
global['DEPLOY_VERSION'] = Date.now();

app
.use(bodyParser.json())
// set up directories
.use('/fonts', express.static(path.join(__dirname, assetsFolder + '/fonts'), { maxAge: '30d' }))
.use('/icons', express.static(path.join(__dirname, assetsFolder + '/icons'), { maxAge: '30d' }))
.use('/images', express.static(path.join(__dirname, assetsFolder + '/images'), { maxAge: '30d' }))
.use(`/css/styles_${DEPLOY_VERSION}.css`, express.static(path.join(__dirname, publicFolder + '/css/styles.css'), { maxAge: '30d' }))
.use(`/css/styles.css`, express.static(path.join(__dirname, publicFolder + '/css/styles.css'), { maxAge: '1d' })) // don't cache as long
.use(`/js/app_${DEPLOY_VERSION}.js`, express.static(path.join(__dirname, publicFolder + '/js/app.js'), { maxAge: '2d' }))
.use('/js/*', express.static(path.join(__dirname, publicFolder + '/js'), { maxAge: '2d' }))
.set('views', path.join(__dirname, assetsFolder + '/templates'))
.set('view engine', 'ejs')

.use('/api', apiRouter)

.get([
  '/',
  '/login',
  '/register',
  '/trade',
  '/trade/:coin',
  '/account'
], (req, res) => {
  serverSideRenderer.handle(req, res, '', '');
});

// start the server
(function (port) {
  mongoose.connect('mongodb://localhost/multiex');

  console.log('Runnig routine...');
  routine.run().then(() => {
    server.listen(port);
    console.log('Listening on port ' + port + '...');
  }).catch((err) => {
    console.log('Routine failed: ', err);
  });

})(8080);