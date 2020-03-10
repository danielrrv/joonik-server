import React from 'react'
import ReactDom from 'react-dom'
import App from '../components/app'

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";

const client = new ApolloClient({
    fetchOptions: {
        credentials: 'include'
    },
    link: createHttpLink({ uri: "https://joonik-node.herokuapp.com/graphql", fetch: fetch }),
    cache: new InMemoryCache(),
});
/**
 * 
 * This instance is reserved to development.
 *  Do not include this file in webpack.config.js(production).
 * File resolve in webpack.config.dev.js  with HMR
*/

ReactDom.render(<App client={client} />, document.getElementById('root'))