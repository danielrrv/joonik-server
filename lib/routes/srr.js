import express from "express";
import App from "../components/app";
import React from "react";
import { renderToString } from "react-dom/server";
import hbs from "handlebars";
import SSRouter from '../components/SSRouter'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from 'node-fetch'
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
  const client = new ApolloClient({
    ssrMode: true,
   //In node environment, fetch is not defined. 
   //One solution is call fetch-node and provide a 'fetch' to Apollo cliente
   //Another option es polyfill with node-cross.
    link: createHttpLink({
      fetch: fetch,
      uri: '/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache(),
  });


//In the server, there's no browser history. So, Staticrouterdoesn't let
//you down.
//@link(https://stackoverflow.com/questions/47384062/how-to-change-staticrouters-location-prop-using-the-link-tag-in-server-side-r)

  const context = {};
  const hbsTemplate = hbs.compile(theHtml);
  const reactComp = renderToString(<SSRouter context={context} location={req.url}><App client={client} /></SSRouter>);
  const htmlToSend = hbsTemplate({ reactele: reactComp });
  if (context.url) {
    return res.redirect(301, context.url)
  }
  res.send(htmlToSend);
});

module.exports = router;