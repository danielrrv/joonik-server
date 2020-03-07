import React from "react";
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import Login from './login'

const App = () => {
    // const { Component, pageProps } = props;
    return (
        <AppProvider i18n={translations}>
            <Login />
            {/* <Component {...pageProps} /> */}
        </AppProvider>
    );
};
export default App;