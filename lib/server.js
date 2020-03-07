
const express = require('express');
const crypto = require('crypto');
require('dotenv').config()
require("regenerator-runtime/runtime");
const session = require('express-session')
const cookie = require('cookie');
const nonce = require('nonce')();
const ShopifyToken = require('shopify-token');
const querystring = require('querystring');
const request = require('request-promise');
const apiKey = process.env.SHOPIFY_API_KEY
const cors = require('cors')
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_products';
const forwardingAddress = 'https://joonik-node.herokuapp.com'; // Replace this with your HTTPS Forwarding address
const path = require('path')
const ssr = require('./routes/srr')

/**
 * @link {https://shopify.dev/tutorials/migrate-your-app-to-support-samesite-cookies}
 * @link {chrome://flags/#samesite}
 * SameSite by default cookies
 * Enable removing SameSite=None cookies
 * Cookies without SameSite must be secure
*/



const app = express();
app.use(cors())

app.set('trust proxy');
// app.use(session({ 
//     secret:'gaticos',
//     name:'siteOption',
//     resave:false,
//     saveUninitialized:false,
//     cookie: { sameSite: 'none', secure: true, htttpOnly: false } }))


app.use(express.static(path.join(__dirname, 'public')))


app.use(session({
    name: "_ft",
    secret: nonce(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "none" }
}))




const shopifyToken = new ShopifyToken({
    sharedSecret: process.env.SHOPIFY_API_SECRET,
    redirectUri: `${forwardingAddress}/callback`,
    apiKey: process.env.SHOPIFY_API_KEY
});



const {
    APP_SHOP,
    SHOPIFY_APP_URL
} = require('../config/index');




/**
 * Middleware to auth into shopify
 * 
*/


// const Auth_shopify = async function (req, res, next) {
//     res.redirect('/shopify')
//     next()
// }


app.get('/shopify', async (req, res) => {
    const shop = APP_SHOP;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/callback';
        const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;

        res.cookie('state', state);
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});


app.get('/callback', async (req, res) => {
    const { shop, hmac, code, state } = req.query;
    try {
        const stateCookie = cookie.parse(req.headers.cookie).state;

        if (state !== stateCookie) {
            return res.status(403).send('Request origin cannot be verified');
        }

        if (shop && hmac && code) {
            // DONE: Validate request is from Shopify
            const map = Object.assign({}, req.query);
            delete map['signature'];
            delete map['hmac'];
            const message = querystring.stringify(map);
            const providedHmac = Buffer.from(hmac, 'utf-8');
            const generatedHash = Buffer.from(
                crypto
                    .createHmac('sha256', apiSecret)
                    .update(message)
                    .digest('hex'),
                'utf-8'
            );
            let hashEquals = false;

            try {
                hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
            } catch (e) {
                hashEquals = false;
            };

            if (!hashEquals) {
                return res.status(400).send('HMAC validation failed');
            }

            // DONE: Exchange temporary code for a permanent access token
            const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
            const accessTokenPayload = {
                client_id: apiKey,
                client_secret: apiSecret,
                code,
            };
            ///setear el token en las cookies
            /**
             * Cuando tenga el access, token, guardar en las cookies y redireccionarlo a 
             * la raiz de la app.
             * 
            */
            request.post(accessTokenRequestUrl, { json: accessTokenPayload })
                .then((accessTokenResponse) => {

                    const accessToken = accessTokenResponse.access_token;
                    // DONE: Use access token to make API call to 'shop' endpoint
                    // const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
                    // const shopRequestHeaders = {
                    //     'X-Shopify-Access-Token': accessToken,
                    // };


                    // res.cookie('_vl', accessToken);
                    res.redirect('/');
                    // request.get(shopRequestUrl, { headers: shopRequestHeaders })
                    //     .then((shopResponse) => {
                    //         res.status(200).end(shopResponse);
                    //     })
                    //     .catch((error) => {
                    //         res.status(error.statusCode).send(error.error.error_description);
                    //     });
                })
                .catch((error) => {
                    res.status(error.statusCode).send(error.error.error_description);
                });

        } else {
            res.status(400).send('Required parameters missing');
        }

    } catch (error) {
        console.warn(error)
        res.status(500).send('something went wrong!')
    }

});


app.post('/graphql', async (request, response) => {
    const shop = request.get('x-shopify-shop-domain');
    const shopAccessToken = request.get('x-shopify-access-token');
    const graphqlEndpoint = `https://${shop}/admin/api/graphql.json`;
    const query = request.body;


    if (!shopAccessToken || !shop || !query) {
        console.log('Missing access token or shop');
        response.status(403).json({ status: 'error', body: 'Error mising required headers' });
        return;
    }

    try {
        await request(graphqlEndpoint, {
            method: 'POST',
            data: query,
            headers: {
                "X-Shopify-Access-Token": shopAccessToken,
                "Content-Type": 'application/json',
                "Accept": 'application/json',
            }
        }).then(result => {
            if (!result) {
                console.error('No data found');
                response.status(500).json({ status: 'error', body: 'No data found.' });
                return
            }

            response.status(200).json(result.data);
            return
        }).catch(error => {
            let errorCode = 500;

            if (error.response.data.errors.includes('Invalid API key or access token')) {
                console.error('Invalid API key or access token');
                errorCode = 401;
            }

            response.status(errorCode).json({ status: 'error', body: error.response && error.response.data.errors });
            return
        })
    } catch (error) {
        console.warn(error.response);
        response.status(500).json({ status: 'error', body: error.response && error.response.data.errors });
        return
    }

})


const redirection = function (req, res, next) {
    // console.log(req.cookies)
    // const firstTime = req.headers.cookie._ft;
    if (!req.cookies) {
        return res.redirect('/shopify')
    }
    next();
}

app.use('/', redirection, ssr)

// app.get('/', Auth_shopify, (req, res) => {
//     res.send('Pagina de incio, listo para desarrollar');
// });

// app.use('/', express.static(path.join(__dirname, 'public')))
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

const PORT = process.env.PORT || 3000;
/**
 * On February 17th 2020, an update 
 * to the Google Chrome browser (Chrome 80) will
 *  change the way websites are able to access browser cookies.
 * 
*/

app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.render('error');
});


app.listen(PORT, () => {
    console.log('joonik listening on port 3000!');
});



