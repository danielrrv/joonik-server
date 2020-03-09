import React from 'react'
import Login from './login'
import Home from './Home'
import EditProduct from './Edit-products'
import { Page } from '@shopify/polaris';
import {
    Router,
    Switch,
    Route,
} from "react-router-dom";

import SSRouter from './SSRouter'                                                                                                
 
const Main = (props) => {
    let user;
    try {
        user = window.localStorage.getItem('uuid');
    } catch (error) {
        console.warn('Unable to restore session')
    }
    const [loggedIn, setLoggedIn] = React.useState(false);

    React.useEffect(() => {
        if (user) {
            setLoggedIn(true)
        }
        if (loggedIn) window.localStorage.setItem('uuid', Math.floor(Math.random() * 100000));
    }, [loggedIn, setLoggedIn])
    
    return (
        <Page>
            <SSRouter>
                <Switch>
                    <Route exact path='/app' render={(props) => (loggedIn ? (<Home {...props} />) : (<Login {...props} login={setLoggedIn} />))} />
                    <Route exact path = '/edit-product' component={EditProduct} />
                </Switch>
            </SSRouter>
        </Page>
    );

}




export default Main;