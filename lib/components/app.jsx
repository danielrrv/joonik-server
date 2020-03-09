import React from "react";
import { AppProvider, TypeOf } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import Main from './Main'
import { Provider } from '@shopify/app-bridge-react';
import { SHOPIFY_APP_URL } from '../../config/index'
// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";



let client;
if (typeof window === 'undefined') {
    client = new ApolloClient({
        // fetchOptions:{
        //     credentials:'include'
        // }
        ssrMode: true,
        link: createHttpLink({ uri: "/graphql", fetch }),
        cache: new InMemoryCache()
    });
} else {
    client = new ApolloClient({
        fetchOptions: {
            credentials: 'include'
        }
    });
}

const App = () => {
    const config = { apiKey: process.env.SHOPIFY_API_KEY, shopOrigin: SHOPIFY_APP_URL, forceRedirect: true }
    return (
        <Provider config={config}>
            <AppProvider i18n={translations}>
                <ApolloProvider client={client}>
                    <Main />
                </ApolloProvider>
            </AppProvider>
        </Provider >
    );
};
export default App;