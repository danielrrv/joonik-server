"use strict";

var express = require('express');

require('dotenv').config();

require("regenerator-runtime/runtime");

var session = require('express-session');

var cookieParser = require('cookie-parser');

var nonce = require('nonce')();

var cors = require('cors');

var forwardingAddress = 'https://joonik-node.herokuapp.com'; // Replace this with your HTTPS Forwarding address

var path = require('path'); //routes


var ssr = require('./routes/srr');

var shopify = require('./routes/shopify');

var callback = require('./routes/callback');

var graphql = require('./routes/graphql');
/**
 * @link {https://shopify.dev/tutorials/migrate-your-app-to-support-samesite-cookies}
 * @link {chrome://flags/#samesite}
 * SameSite by default cookies
 * Enable removing SameSite=None cookies
 * Cookies without SameSite must be secure
*/


var app = express();
app.use(cors()); // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'public'))); //serverSide React app.

/**
 * For set cookies on shopify domain, it is recommended to set "proxy trust". The reason is due to 
 * the app instance runs on Heroku(Saas).
 * 
*/

app.set('trust proxy');
app.use(session({
  name: "_ft",
  secret: nonce(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    sameSite: "none"
  }
}));
/**
 * whether req.cookies.state is not set, redirect to shopify
 * 
*/

var redirection = function redirection(req, res, next) {
  if (!req.cookies.state) {
    return res.redirect('/shopify');
  }

  next();
};

app.use('/', redirection, ssr);
app.use('/shopify', shopify);
app.use('graphql', graphql);
app.use('/callback', callback);
app.use("*", function (req, res) {
  return res.status(404).json({
    error: "not found"
  });
});
app.use(function (err, req, res, next) {
  res.locals.error = err;
  var status = err.status || 500;
  res.status(status);
  res.send('Error Fatal de Servidor');
});
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('joonik listening on port 3000!');
});