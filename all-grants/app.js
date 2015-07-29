/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , site = require('./site')
  , oauth2 = require('./oauth2')
  , user = require('./user')
  , client = require('./client')
  , util = require('util')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , errorHandler = require('errorhandler')
  , stormpath = require('express-stormpath');
  
  
// Express configuration
  
var app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
/*
app.use(function(req, res, next) {
  console.log('-- session --');
  console.dir(req.session);
  //console.log(util.inspect(req.session, true, 3));
  console.log('-------------');
  next()
});
*/
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

app.use(stormpath.init(app, {
    apiKeyFile: '<api key file>',
    application: 'https://api.stormpath.com/v1/applications/xxx',
    secretKey: 'some_long_random_string',
    getOauthTokenUrl: '/oauth/token',
}));

// Passport configuration

require('./auth');


app.get('/', site.index);
// app.get('/login', site.loginForm);
// app.post('/login', site.login);
// app.get('/logout', site.logout);
// app.get('/account', site.account);

app.get('/dialog/authorize', stormpath.authenticationRequired, oauth2.authorization);
app.post('/dialog/authorize/decision', stormpath.authenticationRequired, oauth2.decision);
// app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', stormpath.authenticationRequired, user.info);
app.get('/api/clientinfo', stormpath.authenticationRequired, client.info);

app.listen(3000);
