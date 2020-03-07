import React from 'react'
import Login from './login'
import Home from './Home'
import { Page } from '@shopify/polaris';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

const Main = () => {
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
            <Router>
                <Switch>
                    <Route exact path='/' render={(props) => (loggedIn ? (<Home {...props} />) : (<Login {...props} login={setLoggedIn} />))} />
                </Switch>
            </Router>
        </Page>
    );

}


export default Main;