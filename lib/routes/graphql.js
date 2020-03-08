import express from "express";
const router = express.Router();
const request = require('request-promise');
import Cookies from 'js-cookie';

router.post('/', async (request, response, next) => {
    const shop = request.get('x-shopify-shop-domain');
    const shopAccessToken = request.get('x-shopify-access-token') || Cookies.get('_vl');
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



module.exports = router;