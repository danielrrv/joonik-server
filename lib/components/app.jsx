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


// const client = new ApolloClient({
//     fetchOptions: {
//         credentials: 'include'
//     },
//     link: createHttpLink({ uri: "/graphql", fetch:fetch }),
//     cache: new InMemoryCache(),

// });


const App = ({client}) => {
    const config = { apiKey: process.env.SHOPIFY_API_KEY, shopOrigin: SHOPIFY_APP_URL, forceRedirect: false }
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