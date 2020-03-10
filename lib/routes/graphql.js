import express from "express";
const router = express.Router();
const request = require('request-promise');
import Cookies from 'js-cookie';
import { SHOPIFY_APP_URL } from '../../config/index'
import axios from 'axios'

router.post('/', async (req, res, next) => {
    console.log(req.body)
    const shop = SHOPIFY_APP_URL;
    const shopAccessToken = "36cde54aafd1f2eefa94f761982ec6f1";/*req.get('x-shopify-access-token') ? req.get('x-shopify-access-token') : req.cookies._vl*/
    const graphqlEndpoint = `https://${shop}/admin/api/2020-01/graphql.json`;
    const query = req.body;
    if (!shopAccessToken || !shop || !query) {
        console.log('Missing access token or shop');
        res.status(403).json({ status: 'error', body: 'Error mising required headers' });
        return;
    }
    try {
        // console.log('pasando por  el try catch')
        await axios(graphqlEndpoint, {
            method: 'POST',
            data: query,
            headers: {
                "X-Shopify-Access-Token": shopAccessToken,
                "Content-Type": 'application/json',
                "Accept": 'application/json',
            }
        })
            .then(result => {
                if (!result) {
                    console.error('No data found');
                    res.status(500).json({ status: 'error', body: 'No data found.' });
                    return;
                }
                console.log(result.data);

                res.status(200).json(result.data);
                return;
            }).catch(error => {
                let errorCode = 500;

                if (error.response.data.errors.includes('Invalid API key or access token')) {
                    console.error('Invalid API key or access token');
                    errorCode = 401;
                }
                res.status(errorCode).json({ status: 'error', body: error.response && error.response.data.errors });
                return;
            })
    } catch (error) {
        console.warn(error.response);
        res.status(500).json({ status: 'error', body: error.response && error.response.data.errors });
        return;
    }

})



module.exports = router;




