import React from "react";
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import Main from './Main'
import { Provider } from '@shopify/app-bridge-react';
import { SHOPIFY_APP_URL } from '../../config/index'



const App = () => {
    const config = { apiKey: process.env.SHOPIFY_API_KEY, shopOrigin:SHOPIFY_APP_URL , forceRedirect: true }
    return (
        <AppProvider i18n={translations}>
            <AppProvider config={config}>
                <Main />
            </AppProvider>
        </AppProvider>
    );
};
export default App;