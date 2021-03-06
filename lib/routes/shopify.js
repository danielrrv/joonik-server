const express = require("express");
const router = express.Router();
import { SHOPIFY_APP_URL, SCOPES, EXTERNAL_APP_URL } from '../../config/index'
const apiKey = process.env.SHOPIFY_API_KEY
const nonce = require('nonce')();


router.all('/', (req, res, next) => {
    const shop = req.query.shop || SHOPIFY_APP_URL;
    if (shop) {
        const state = nonce();
        const redirectUri = EXTERNAL_APP_URL + '/callback';
        const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + SCOPES +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;
        res.cookie('state', state, { sameSite: 'none', secure: true });
        return res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
})
module.exports = router;
