const app = require('../dist/server') // Link to your server file
const supertest = require('supertest')
const request = supertest.agent(app)

//Mocking mathMedia funcction because this method doesn't
//exist in JSDOM.

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});



describe('Endpoint "/"', () => {
    fit('Gets redirect to /shopify, if not cookies set', async done => {
        const response = await request.get('/');
        expect(response.status).toBe(302)//redirect
        expect(response.header.location).toBe('/shopify');
        done();
    })
    fit('Gets server-side render when cookies are set', async done => {
        const response = await request.get('/').set('cookie', 'state=12345678')
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toMatch(/text\/html/)
        done()
    })
})



describe('Endpoint "/shopify"', () => {
    fit('Gets redirect to /callback', async done => {
        const response = await request.get('/shopify');
        expect(response.status).toBe(302)//redirect
        expect(response.header.location).toMatch(/(client_id=\d{3,})|(redirect_uri=\\https)|(state)|(\/callback)/g);
        done();
    })
    fit('Save cookie as state on /shopify', async done => {
        const response = await request.get('/shopify');
        expect(response.header['set-cookie']).toBeDefined();
        done();
    })
})





