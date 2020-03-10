import express from "express";
import App from "../components/app";
import React from "react";
import { renderToString } from "react-dom/server";
import hbs from "handlebars";
import SSRouter from '../components/SSRouter'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";

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

  // <script>
  // window.__APOLLO_STATE__= JSON.stringify(client.extract());
  //   </script>



  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
       uri: 'https://joonik-node.herokuapp.com/graphql',
      credentials: 'same-origin',
      // headers: {
      //   cookie: req.header('Cook'),
      // },
    }),
    cache: new InMemoryCache(),
  });




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