import React from 'react'
import Login from './login'
import Home from './Home'
import EditProduct from '../components/Create-products'
import { Page } from '@shopify/polaris';
import {
    Router,
    Switch,
    Route,
} from "react-router-dom";


//The router. This sets a history according to the enviroment where the router
//is render on. 
import SSRouter from '../components/SSRouter'                                                                                                
 
const Main = (props) => {
    let user;
    try {
        //for keeping a session.
        user = window.localStorage.getItem('uuid');
    } catch (error) {
        console.warn('Unable to restore session')
    }
    const [loggedIn, setLoggedIn] = React.useState(false);
    //efect to re-render when the loggedIn changes.
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
                    <Route exact path='/' render={(props) => (loggedIn ? (<Home {...props} />) : (<Login {...props} login={setLoggedIn} />))} />
                    <Route exact path = '/edit-product' component={EditProduct} />
                </Switch>
            </SSRouter>
        </Page>
    );

}




export default Main;