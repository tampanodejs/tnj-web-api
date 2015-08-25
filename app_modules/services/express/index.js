'use strict';

var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var errorHandler = require('../../../routes/utils/errorHandler')();
var uuid = require('node-uuid');
var logger = global.logger;
var swaggerNodeExpress = require('swagger-node-express');
var path = require('path');
var port = process.env.PORT || 7200;
var server = require('http').createServer(app);
var passport = require('passport');

/*
 * configure Passport
 */

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
var socketio = require('socket.io')(server, {
  serveClient: true,
  transports: ['websocket']
});

var io;

module.exports = {
  init: init,
  io: io
};

function init() {
  var RedisStore = require('connect-redis')(session);
  var options = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    pass: process.env.REDIS_PASSWORD || null
  };
  app.use(session({
    store: new RedisStore(options),
    secret: 'd638832ad53c2b9cf81ee234ca8f607ba658b54a',
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({limit: '1mb'}));
  app.use(compress());
  app.use(cors({
    origin: '*'
  }));
  app.set('json spaces', 4);
  app.use(function(req, res, next) {
    req.transactionId = uuid.v1();
    req.clientRequestId = req.headers['x-client-request-id'] || '';
    next();
  });

  var apiInfo = {
    title: 'webclient',
    description: 'webclient',
    termsOfServiceUrl: 'http://localhost/terms/',
    contact: 'softwaredevelopers@352inc.com',
    license: 'Apache 2.0',
    licenseUrl: 'http://www.apache.org/licenses/LICENSE-2.0.html'
  };

  var swagger = swaggerNodeExpress.createNew(app);

  swagger.setApiInfo(apiInfo);
  app.swagger = swagger;

  var routes = require('../../../routes/index')(app, swagger, passport);
  var baseUrl = '';
  swagger.configureSwaggerPaths('', 'api-docs', '');
  if (process.env.NODE_ENV == 'dev') {
    baseUrl = 'http://localhost:7200';
  } else {
    baseUrl = 'https://' + process.env.APP_NAME + '.herokuapp.com';
  }
  swagger.configure(baseUrl + '/api', '1.0.0');

  /*
   * Serve up swagger ui at /docs via static route
   */

  var swaggerUIPath = path.join(__dirname, '../node_modules/swagger-node-express/swagger-ui/');
  var docsHandler = express.static(swaggerUIPath);

  app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
    if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
      res.writeHead(302, {'Location' : req.url + '/index.html?url=' + baseUrl + '/api-docs'});
      res.end();
      return;
    } else if (req.url === '/docs/') {
      res.writeHead(302, {'Location' : req.url + 'index.html?url=' + baseUrl + '/api-docs'});
      res.end();
      return;
    }

    /*
     * take off leading /docs so that connect locates file correctly
     */

    req.url = req.url.substr('/docs'.length);
    return docsHandler(req, res, next);
  });

  /*
   * Configure socket.io.
   */
  var redis = require('redis').createClient;
  var adapter = require('socket.io-redis');
  var pub = redis(process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || '127.0.0.1', {detect_buffers: true, auth_pass: process.env.REDIS_PASSWORD || null});
  var sub = redis(process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || '127.0.0.1', {detect_buffers: true, auth_pass: process.env.REDIS_PASSWORD || null});
  socketio.adapter(adapter({pubClient: pub, subClient: sub}));
  io = require('../socketio')(socketio);

  app.use(errorHandler.init);

  server.listen(port, function() {
    logger.info('Express server listening on port ' + port);
  });
}