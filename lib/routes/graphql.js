import express from "express";
const router = express.Router();
const request = require('request-promise');
import Cookies from 'js-cookie';
import { SHOPIFY_APP_URL } from '../../config/index'


router.post('/', async (req, res, next) => {
    const shop = SHOPIFY_APP_URL;
    // console.log('psando')
    // console.log(typeof req.get('x-shopify-access-token'))
    const shopAccessToken = req.get('x-shopify-access-token') || Cookies.get('_vl');
    const graphqlEndpoint = `https://${shop}/admin/api/graphql.json`;
    const query = req.body;

    if (!shopAccessToken || !shop || !query) {
        console.log('Missing access token or shop');
        res.status(403).json({ status: 'error', body: 'Error mising required headers' });
        return;
    }
    try {
        // console.log('pasando por  el try catch')
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
                res.status(500).json({ status: 'error', body: 'No data found.' });
                return
            }

            res.status(200).json(result.data);
            return
        }).catch(error => {
            let errorCode = 500;

            if (error.response.data.errors.includes('Invalid API key or access token')) {
                console.error('Invalid API key or access token');
                errorCode = 401;
            }

            res.status(errorCode).json({ status: 'error', body: error.response && error.response.data.errors });
            return
        })
    } catch (error) {
        console.warn(error.response);
        res.status(500).json({ status: 'error', body: error.response && error.response.data.errors });
        return;
    }

})



module.exports = router;