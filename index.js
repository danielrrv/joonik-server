
const express = require('express');
const crypto = require('crypto');
require('dotenv').config()
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


const app = express();

const {
    APP_SHOP,
    SHOPIFY_APP_URL
} = require('./config/index');





app.use(cors())



const shopifyToken = new ShopifyToken({
    redirectUri: `${SHOPIFY_APP_URL}/callback`,
    sharedSecret: apiSecret,
    scopes: 'read_products',
    apiKey: apiKey,
    // accessMode: 'per-user',
    timeout: 10000,
});






app.get('/shopify', async (req, res) => {
    try {
        shopifyToken.shop = APP_SHOP.replace('.myshopify', '')
        const nonce = shopifyToken.generateNonce();
        const uri = shopifyToken.generateAuthUrl(shopifyToken.shop, 'read_products', nonce);
        // const redirectUri = forwardingAddress + '/shopify/callback';
        // const installUrl = 'https://' + APP_SHOP +
        //     '/admin/oauth/authorize?client_id=' + apiKey +
        //     '&scope=' + scopes +
        //     '&state=' + state +
        //     '&redirect_uri=' + redirectUri;
        res.cookie('state', nonce);
        res.status(200).send(`<div><a href=${uri}>${uri}</a></div>`);

    } catch (error) {
        console.warn(e);
        return response.status(500).json({ status: 'error' });
    }

});



app.get('/callback', async (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    // if (state !== stateCookie) {
    //     return res.status(403).send('Request origin cannot be verified');
    // }


    if (!shop || !hmac || !code) {
        return res.status(422).json({ status: "Unsopported Action" });
    }

    if (shopifyToken.verifyHmac(request.query)) {
        // Get permanent access token that will be used in the future to make API calls
        const data = await shopifyToken.getAccessToken(shop, code)
        // let timeNow = + new Date()
        // const expiresAt = timeNow + (data.expires_in - 20 * 1000)
        // const tokenData = { ...data, expires_at: expiresAt } // TODO: change from unix timestamp to Firestore date
        const token = tokenData.access_token;
        const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
        const shopRequestHeaders = {
            'X-Shopify-Access-Token': data.access_token,
        }

        request.get(shopRequestUrl, { headers: shopRequestHeaders })
            .then((shopResponse) => {
                res.status(200).end(shopResponse);
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });

    } else {
        return response.status(500).json({ status: 'Error occurred', error: e.stack })
    }





    // if (shop && hmac && code) {
    //     // DONE: Validate request is from Shopify
    //     const map = Object.assign({}, req.query);
    //     delete map['signature'];
    //     delete map['hmac'];
    //     const message = querystring.stringify(map);
    //     const providedHmac = Buffer.from(hmac, 'utf-8');
    //     const generatedHash = Buffer.from(
    //         crypto
    //             .createHmac('sha256', apiSecret)
    //             .update(message)
    //             .digest('hex'),
    //         'utf-8'
    //     );
    //     let hashEquals = false;

    //     try {
    //         hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
    //     } catch (e) {
    //         hashEquals = false;
    //     };

    //     if (!hashEquals) {
    //         return res.status(400).send('HMAC validation failed');
    //     }

    // DONE: Exchange temporary code for a permanent access token

    // const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
    // const accessTokenPayload = {
    //     client_id: apiKey,
    //     client_secret: apiSecret,
    //     code,
    // };

    // request.post(accessTokenRequestUrl, { json: accessTokenPayload })
    //     .then((accessTokenResponse) => {
    //         const accessToken = accessTokenResponse.access_token;
    //         // DONE: Use access token to make API call to 'shop' endpoint
    //         const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
    //         const shopRequestHeaders = {
    //             'X-Shopify-Access-Token': accessToken,
    //         };

    //         request.get(shopRequestUrl, { headers: shopRequestHeaders })
    //             .then((shopResponse) => {
    //                 res.status(200).end(shopResponse);
    //             })
    //             .catch((error) => {
    //                 res.status(error.statusCode).send(error.error.error_description);
    //             });
    //     })
    //     .catch((error) => {
    //         res.status(error.statusCode).send(error.error.error_description);
    //     });

    // } else {
    //     res.status(400).send('Required parameters missing');
    // }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Example app listening on port 3000!');
});



