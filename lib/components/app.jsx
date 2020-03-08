import React from "react";
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import Main from './Main'




const App = () => {
    return (
    
        <AppProvider i18n={translations}>
            <Main />
        </AppProvider>
    );
};
export default App;