import { createBrowserHistory } from 'history'; 
import { createMemoryHistory } from 'history'
import {Router} from "react-router-dom";
import React from 'react'
export default ({url='/',children}) => {
    const isServer = (typeof window ==='undefined')
    // Create a history depending on the environment
      const history = isServer
        ? createMemoryHistory({
            initialEntries: [url]
         })
       : createBrowserHistory();
       return<Router children={children} history={history}/>;
    }