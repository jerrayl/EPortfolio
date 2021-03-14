/**
 * @jest-environment ./ServerEnvironment
 */

const {connectDB, disconnectDB} = require('../../server/config/db');
const firebase = require('../../client/node_modules/firebase');
const firebaseConfig = require('../../client/src/utils/firebaseConfig').firebaseConfig;

let token, portfolio_id;

beforeAll(async () => {
    connectDB();
    firebase.initializeApp(firebaseConfig);
    await firebase.auth().signInWithEmailAndPassword('quaranteamjesttest@gmail.com', 'quaranteam').then(async () => {
        await firebase.auth().currentUser.getIdToken(true)
        .then(function (idToken){
            token = idToken;
        });
    });

    // Create a portfolio to test with
    const res = await global.app
        .post('/api/portfolio/')
        .set('x-auth-token', token)
        .send({
            name: 'Jest testing page portfolio',
            template: 'blank',
            private: false
        });
    portfolio_id = res.body._id;
});

afterAll(async () => {
    // Delete portfolio created in beforeAll()
    await global.app
        .delete('/api/portfolio/delete/'+portfolio_id)
        .set('x-auth-token', token);
    await disconnectDB();
    await firebase.auth().signOut();
    await firebase.app().delete();
    // prevent open handle error
    await new Promise(resolve => setTimeout(() => resolve(), 1000));
});

it('Create page on portfolio', async () => {
    const res = await global.app
        .post('/api/page')
        .set('x-auth-token', token)
        .send({
            portfolio: portfolio_id,
            pagename: 'Jest test page'
        });
    expect(res.status).toBe(200);
});

it('Edit name of page on a portfolio', async () => {
    const res = await global.app
        .post('/api/page/editname')
        .set('x-auth-token', token)
        .send({
            portfolio: portfolio_id,
            oldname: 'Jest test page',
            newname: 'Jest test edit page name'
        });
    expect(res.status).toBe(200);
});

it('Make created page main page', async () => {
    const res = await global.app
        .put('/api/page/makemain')
        .set('x-auth-token', token)
        .send({
            portfolio: portfolio_id,
            pagename: 'Jest test edit page name'
        });
    expect(res.status).toBe(200);
});

describe('Get page routes', () => {
    it('Get page by portfolio and url as logged in owner', async () => {
        const res = await global.app
            .get('/api/page/single/'+portfolio_id+'/'+encodeURI('Jest test edit page name'))
            .set('x-auth-token', token)
            .send();
        expect(res.status).toBe(200);
    });

    it('Get page by portfolio and url as guest', async () => {
        const res = await global.app
            .get('/api/page/guest/'+portfolio_id+'/'+encodeURI('Jest test edit page name'))
            .send();
        expect(res.status).toBe(200);
    });

    it('Get page by portfolio and url as guest & portfolio private', async () => {
        await global.app
            .put('/api/portfolio/edit')
            .set('x-auth-token', token)
            .send({
                portfolio: portfolio_id,
                field: 'privacy',
                value: true
            });

        const res = await global.app
            .get('/api/page/guest/'+portfolio_id+'/'+encodeURI('Jest test edit page name'))
            .send();
        expect(res.status).toBe(401);
    });
    
    it('Get page by portfolio and url as logged in user (not permitted or owner) & portfolio private', async () => {
        let otherToken;

        // Sign out current user
        await firebase.auth().signOut();
        // Sign in other user to access
        await firebase.auth().signInWithEmailAndPassword('arixeyenia@gmail.com', 'password').then(async () => {
            await firebase.auth().currentUser.getIdToken(true)
            .then(function (idToken){
                otherToken = idToken;
            });
        });
        // Test access as not permitted user
        const res = await global.app
            .get('/api/page/single/'+portfolio_id+'/'+encodeURI('Jest test edit page name'))
            .set('x-auth-token', otherToken)
            .send();
        expect(res.status).toBe(401);
        // Return logged in user to test account
        await firebase.auth().signOut();
        await firebase.auth().signInWithEmailAndPassword('quaranteamjesttest@gmail.com', 'quaranteam').then(async () => {
            await firebase.auth().currentUser.getIdToken(true)
            .then(function (idToken){
                token = idToken;
            });
        });
    });

    it('Get page by portfolio and url as logged in user (permitted & not owner) & portfolio private', async () => {
        let otherToken;

        // Add other user to permission of portfolio
        await global.app
            .put('/api/portfolio/permission')
            .set('x-auth-token', token)
            .send({
                portfolio: portfolio_id,
                add: true,
                email: 'arixeyenia@gmail.com'
            });
        // Sign out current user
        await firebase.auth().signOut();
        // Sign in other user to access
        await firebase.auth().signInWithEmailAndPassword('arixeyenia@gmail.com', 'password').then(async () => {
            await firebase.auth().currentUser.getIdToken(true)
            .then(function (idToken){
                otherToken = idToken;
            });
        });
        // Test access as permitted user
        const res = await global.app
            .get('/api/page/single/'+portfolio_id+'/'+encodeURI('Jest test edit page name'))
            .set('x-auth-token', otherToken)
            .send();
        expect(res.status).toBe(200);
        // Return logged in user to test account
        await firebase.auth().signOut();
        await firebase.auth().signInWithEmailAndPassword('quaranteamjesttest@gmail.com', 'quaranteam').then(async () => {
            await firebase.auth().currentUser.getIdToken(true)
            .then(function (idToken){
                token = idToken;
            });
        });
    });
});

it('Delete page', async () => {
    // Cannot delete created page because it is main
    // Make home main
    await global.app
        .put('/api/page/makemain')
        .set('x-auth-token', token)
        .send({
            portfolio: portfolio_id,
            pagename: 'Home'
        });
    const res = await global.app
        .delete('/api/page/'+portfolio_id+'/'+encodeURI('Jest test edit page name'))
        .set('x-auth-token', token);
    expect(res.status).toBe(200);
});