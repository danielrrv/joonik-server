import express from "express";
import App from "../components/app";
import React from "react";
import { renderToString } from "react-dom/server";
import hbs from "handlebars";
import SSRouter from '../components/SSRouter'

const router = express.Router();

router.get("/", async (req, res) => {
  const theHtml = `
    <html>
    <head>
    <title>JoonikShop</title>
    <link
  rel="stylesheet"
  href="https://unpkg.com/@shopify/polaris@4.14.0/styles.min.css"/>
    </head>
    <body>
    <div id="reactele">{{{reactele}}}</div>
    <script src="/app.js" charset="utf-8"></script>
    <script src="/vendor.js" charset="utf-8"></script>
    </body>
    </html>
    `;
    console.log('SERVER SIDE ')
  const context = {};
  const hbsTemplate = hbs.compile(theHtml);
  const reactComp = renderToString(<SSRouter context={context} location={req.url}><App /></SSRouter>);
  const htmlToSend = hbsTemplate({ reactele: reactComp });
  if(context.url){
    return res.redirect(301,context.url)
  }
  res.send(htmlToSend);
});

module.exports = router;