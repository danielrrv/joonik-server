import React from 'react'
import ReactDom from 'react-dom'
import App from '../components/app'
/**
 * 
 * This instance is reserved to development.
 *  Do not include this file in webpack.config.js(production).
 * File resolve in webpack.config.dev.js  with HMR
*/

ReactDom.render(<App />, document.getElementById('root'))