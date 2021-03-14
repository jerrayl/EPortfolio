/**
 * @jest-environment ./ServerEnvironment
 */

const {connectDB, disconnectDB} = require('../../server/config/db');
const firebase = require('../../client/node_modules/firebase');
const firebaseConfig = require('../../client/src/utils/firebaseConfig').firebaseConfig;

let token, otherToken, portfolio_id;

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
    
    // Sign in with another account
    await firebase.auth().signOut();
    await firebase.auth().signInWithEmailAndPassword('arixeyenia@gmail.com', 'password').then(async () => {
        await firebase.auth().currentUser.getIdToken(true)
        .then(function (idToken){
            otherToken = idToken;
        });
    });

    // Login to backend
    await global.app
        .post('/api/auth')
        .set('x-auth-token', otherToken);

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
    await new Promise(resolve => setTimeout(() => resolve(), 500));
});

it("Add created portfolio to another account's favourites", async () => {
    const res = await global.app
        .put('/api/user/save')
        .set('x-auth-token', otherToken)
        .send({
            portfolio: portfolio_id
        });
    expect(res.status).toBe(200);
});

it("Get favourites of that account", async () => {
    const res = await global.app
        .get('/api/user/saved')
        .set('x-auth-token', otherToken);
    expect(res.status).toBe(200);
});