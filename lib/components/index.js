import React from "react";
import { render, hydrate } from "react-dom";
import App from "./app";
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";

const client = new ApolloClient({
    fetchOptions: {
        credentials: 'include'
    },
    link: createHttpLink({ uri: "/graphql", fetch: fetch }),
    cache: new InMemoryCache(),
});


hydrate(<App client={client} />, document.getElementById("reactele"));