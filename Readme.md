# JoonikShop

Server-side react app to integrate shopify services.

## How to use.

* This app does not accept a custom shop yet. I uses a JoonikShop sample account.

* The app is server-side render. Althougth, server static bundle on '/'

* The login username& password can be found on config folder


## How does it work
* A Nodejs server serves endpoint to  get authorization from shopify and the serves first
server-side rendering, followed by a hydratation. The challange is generate all the interactive environment on the server, in which there's no any browser capability as fetch and browser history


## Scripts

#### npm start
To run a developement version with server and React app.

### npm run dev
To run a development version of React-app standalone.

### npm run serve 
To run a development version accompanied with   `nodemon`

### npm run test
To run sample test of the API. The test enviroment is Jest and supertest.

>No react test developed

### npm run build

To build a transpilate version of the app. In addition, build react app.


### npm run lint 

Checking eslint rules.
