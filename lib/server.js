const express = require('express');
require('dotenv').config()
require("regenerator-runtime/runtime");
const session = require('express-session')
const cookieParser = require('cookie-parser')
const nonce = require('nonce')();
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
var morgan = require('morgan')
//routes
const ssr = require('./routes/srr');
const shopify = require('./routes/shopify');
const callback = require('./routes/callback');
const graphql = require('./routes/graphql');

/**
 * @link {https://shopify.dev/tutorials/migrate-your-app-to-support-samesite-cookies}
 * @link {chrome://flags/#samesite}
 * SameSite by default cookies
 * Enable removing SameSite=None cookies
 * Cookies without SameSite must be secure
*/
const app = express();
app.use(bodyParser.json())
process.env.NODE_ENV === 'development' && app.use(morgan('dev'))

// const whitelist = 'joonikshop.myshopify.com'
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist === origin || !origin) {
//             return callback(null, true)
//         } else {
//             return callback(new Error('Not allowed by CORS'))
//         }
//     },
// }
// process.env.NODE_ENV === 'production' ? app.use(cors(corsOptions)) : app.use(cors());
app.use(cors())


// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser())
/**
 * After the first renderToString( <App/>) ReactDom.hydrate(<App/>) is going to reuse the
 * server-rendered HTML. This will connect  static files(bundle, vendor) to this HTML
*/
app.use(express.static(path.join(__dirname, 'public')))//serverSide React app.

/**
 * For set cookies on shopify domain, it is recommended to set "proxy trust". The reason is due to 
 * the app instance runs on Heroku(Saas).
 * 
*/
app.set('trust proxy');
/**
 * whether req.cookies.state is not set,it redirects to shopify
*/
const redirection = function (req, res, next) {
    if (!req.cookies.state) {
        console.log('many redirect')
        return res.redirect('/shopify')
    }
    next();
    
}

app.use('/shopify', shopify);
app.use('/graphql', graphql)
app.use('/callback', callback);
app.use('*', redirection, ssr);
// app.use("*", (req, res) => res.status(404).json({ error: "not found" }))
app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.send('Error Fatal de Servidor');
});
 


module.exports = app



