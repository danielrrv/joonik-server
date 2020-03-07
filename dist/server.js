"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var crypto = require('crypto');

require('dotenv').config();

require("regenerator-runtime/runtime");

var session = require('express-session');

var cookie = require('cookie');

var nonce = require('nonce')();

var ShopifyToken = require('shopify-token');

var querystring = require('querystring');

var request = require('request-promise');

var apiKey = process.env.SHOPIFY_API_KEY;

var cors = require('cors');

var apiSecret = process.env.SHOPIFY_API_SECRET;
var scopes = 'read_products';
var forwardingAddress = 'https://joonik-node.herokuapp.com'; // Replace this with your HTTPS Forwarding address

var path = require('path');

var ssr = require('./routes/srr');
/**
 * @link {https://shopify.dev/tutorials/migrate-your-app-to-support-samesite-cookies}
 * @link {chrome://flags/#samesite}
 * SameSite by default cookies
 * Enable removing SameSite=None cookies
 * Cookies without SameSite must be secure
*/


var app = express();
app.use(cors());
app.set('trust proxy');
app.use(session({
  secret: 'gaticos',
  name: 'siteOption',
  resave: false,
  sameSite: "none",
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
    secure: true,
    htttpOnly: false
  }
}));
app.use(express["static"](path.join(__dirname, 'public')));
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
var shopifyToken = new ShopifyToken({
  sharedSecret: process.env.SHOPIFY_API_SECRET,
  redirectUri: "".concat(forwardingAddress, "/callback"),
  apiKey: process.env.SHOPIFY_API_KEY
});

var _require = require('../config/index'),
    APP_SHOP = _require.APP_SHOP,
    SHOPIFY_APP_URL = _require.SHOPIFY_APP_URL;
/**
 * Middleware to auth into shopify
 * 
*/
// const Auth_shopify = async function (req, res, next) {
//     res.redirect('/shopify')
//     next()
// }


app.get('/shopify', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var shop, state, redirectUri, installUrl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            shop = APP_SHOP;

            if (!shop) {
              _context.next = 9;
              break;
            }

            state = nonce();
            redirectUri = forwardingAddress + '/callback';
            installUrl = 'https://' + shop + '/admin/oauth/authorize?client_id=' + apiKey + '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri;
            res.cookie('state', state);
            res.redirect(installUrl);
            _context.next = 10;
            break;

          case 9:
            return _context.abrupt("return", res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request'));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/callback', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$query, shop, hmac, code, state, stateCookie, map, message, providedHmac, generatedHash, hashEquals, accessTokenRequestUrl, accessTokenPayload;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$query = req.query, shop = _req$query.shop, hmac = _req$query.hmac, code = _req$query.code, state = _req$query.state;
            _context2.prev = 1;
            stateCookie = cookie.parse(req.headers.cookie).state;

            if (!(state !== stateCookie)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", res.status(403).send("Request origin cannot be verified\nprevious:".concat(state, "\t").concat(stateCookie)));

          case 5:
            if (!(shop && hmac && code)) {
              _context2.next = 22;
              break;
            }

            // DONE: Validate request is from Shopify
            map = Object.assign({}, req.query);
            delete map['signature'];
            delete map['hmac'];
            message = querystring.stringify(map);
            providedHmac = Buffer.from(hmac, 'utf-8');
            generatedHash = Buffer.from(crypto.createHmac('sha256', apiSecret).update(message).digest('hex'), 'utf-8');
            hashEquals = false;

            try {
              hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
            } catch (e) {
              hashEquals = false;
            }

            ;

            if (hashEquals) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return", res.status(400).send('HMAC validation failed'));

          case 17:
            // DONE: Exchange temporary code for a permanent access token
            accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
            accessTokenPayload = {
              client_id: apiKey,
              client_secret: apiSecret,
              code: code
            }; ///setear el token en las cookies

            /**
             * Cuando tenga el access, token, guardar en las cookies y redireccionarlo a 
             * la raiz de la app.
             * 
            */

            request.post(accessTokenRequestUrl, {
              json: accessTokenPayload
            }).then(function (accessTokenResponse) {
              var accessToken = accessTokenResponse.access_token; // DONE: Use access token to make API call to 'shop' endpoint
              // const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
              // const shopRequestHeaders = {
              //     'X-Shopify-Access-Token': accessToken,
              // };
              // res.cookie('_vl', accessToken);

              res.redirect('/'); // request.get(shopRequestUrl, { headers: shopRequestHeaders })
              //     .then((shopResponse) => {
              //         res.status(200).end(shopResponse);
              //     })
              //     .catch((error) => {
              //         res.status(error.statusCode).send(error.error.error_description);
              //     });
            })["catch"](function (error) {
              res.status(error.statusCode).send(error.error.error_description);
            });
            _context2.next = 23;
            break;

          case 22:
            res.status(400).send('Required parameters missing');

          case 23:
            _context2.next = 29;
            break;

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2["catch"](1);
            console.warn(_context2.t0);
            res.status(500).send('something went wrong!');

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 25]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.post('/graphql', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var shop, shopAccessToken, graphqlEndpoint, query;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            shop = request.get('x-shopify-shop-domain');
            shopAccessToken = request.get('x-shopify-access-token');
            graphqlEndpoint = "https://".concat(shop, "/admin/api/graphql.json");
            query = request.body;

            if (!(!shopAccessToken || !shop || !query)) {
              _context3.next = 8;
              break;
            }

            console.log('Missing access token or shop');
            response.status(403).json({
              status: 'error',
              body: 'Error mising required headers'
            });
            return _context3.abrupt("return");

          case 8:
            _context3.prev = 8;
            _context3.next = 11;
            return request(graphqlEndpoint, {
              method: 'POST',
              data: query,
              headers: {
                "X-Shopify-Access-Token": shopAccessToken,
                "Content-Type": 'application/json',
                "Accept": 'application/json'
              }
            }).then(function (result) {
              if (!result) {
                console.error('No data found');
                response.status(500).json({
                  status: 'error',
                  body: 'No data found.'
                });
                return;
              }

              response.status(200).json(result.data);
              return;
            })["catch"](function (error) {
              var errorCode = 500;

              if (error.response.data.errors.includes('Invalid API key or access token')) {
                console.error('Invalid API key or access token');
                errorCode = 401;
              }

              response.status(errorCode).json({
                status: 'error',
                body: error.response && error.response.data.errors
              });
              return;
            });

          case 11:
            _context3.next = 18;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](8);
            console.warn(_context3.t0.response);
            response.status(500).json({
              status: 'error',
              body: _context3.t0.response && _context3.t0.response.data.errors
            });
            return _context3.abrupt("return");

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[8, 13]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

var redirection = function redirection(req, res, next) {
  if (!req.cookies) {
    return res.redirect('/shopify');
  }

  next();
};

app.use('/', redirection, ssr); // app.get('/', Auth_shopify, (req, res) => {
//     res.send('Pagina de incio, listo para desarrollar');
// });
// app.use('/', express.static(path.join(__dirname, 'public')))

app.use("*", function (req, res) {
  return res.status(404).json({
    error: "not found"
  });
});
var PORT = process.env.PORT || 3000;
/**
 * On February 17th 2020, an update 
 * to the Google Chrome browser (Chrome 80) will
 *  change the way websites are able to access browser cookies.
 * 
*/

app.use(function (err, req, res, next) {
  res.locals.error = err;
  var status = err.status || 500;
  res.status(status);
  res.render('error');
});
app.listen(PORT, function () {
  console.log('joonik listening on port 3000!');
});