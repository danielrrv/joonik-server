const express=require("express");
const router = express.Router();
const crypto = require('crypto');
const apiSecret = process.env.SHOPIFY_API_SECRET;
const apiKey = process.env.SHOPIFY_API_KEY
const querystring = require('querystring');
const request = require('request-promise');


router.get('/', (req, res, next) => {
    const { shop, hmac, code, state } = req.query;
    try {

     
        if (!req.cookies.state) {
            return res.status(404).send('No cookies');
        }
        const stateCookie = req.cookies.state;
        if (state !== stateCookie) {
            return res.status(403).send(`Request origin cannot be verified  previous:${state} now:${req.headers}`);
        }

        if (shop && hmac && code && state) {
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
            }

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
            /**
             * Cuando tenga el access, token, guardar en las cookies y redireccionarlo a 
             * la raiz de la app.
             * 
            */
            request.post(accessTokenRequestUrl, { json: accessTokenPayload })
                .then((accessTokenResponse) => {
                    const accessToken = accessTokenResponse.access_token;
                    res.set('x-shopify-access-token', accessToken);
                    return res.redirect('/');
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

})



module.exports = router;