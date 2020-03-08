const express = require('express');
require('dotenv').config()
require("regenerator-runtime/runtime");
const session = require('express-session')
const cookieParser = require('cookie-parser')
const nonce = require('nonce')();
const cors = require('cors')

const forwardingAddress = 'https://joonik-node.herokuapp.com'; // Replace this with your HTTPS Forwarding address
const path = require('path')
//routes
const ssr = require('./routes/srr');
const shopify = require('./routes/shopify');
const callback = require('./routes/callback');
const graphql  = require('./routes/graphql');

/**
 * @link {https://shopify.dev/tutorials/migrate-your-app-to-support-samesite-cookies}
 * @link {chrome://flags/#samesite}
 * SameSite by default cookies
 * Enable removing SameSite=None cookies
 * Cookies without SameSite must be secure
*/
const app = express();
app.use(cors())
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser())
/**
 * After the first renderTostring( <App/>) ReactDom.hydrate(<App/>) is going to reuse the
 * server-rendered HTML. This will connect  static files(bundle, vendor) to this HTML
*/
app.use(express.static(path.join(__dirname, 'public')))//serverSide React app.

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
    cookie: { secure: true, sameSite: "none" }
}))
/**
 * whether req.cookies.state is not set, redirect to shopify
 * 
*/
const redirection = function (req, res, next) {
    if (!req.cookies.state) {
        console.log('many redirect')
        return res.redirect('/shopify')
    }
    next();
}

app.use('/', ssr);
app.use('/shopify', shopify);
app.use('graphql',graphql)
app.use('/callback', callback);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))
app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.send('Error Fatal de Servidor');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('joonik listening on port 3000!');
});



