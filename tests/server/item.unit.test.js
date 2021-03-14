/**
 * @jest-environment ./ServerEnvironment
 */

const {connectDB, disconnectDB} = require('../../server/config/db');
const firebase = require('../../client/node_modules/firebase');
const firebaseConfig = require('../../client/src/utils/firebaseConfig').firebaseConfig;

let token, portfolio_id, item_id;

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

it('Create an item', async () => {
    const res = await global.app
        .post('/api/item')
        .set('x-auth-token', token)
        .send({
            portfolio: portfolio_id,
            pagename: 'Home',
            private: false,
            title: 'Jest created this',
            subtitle: 'This is part of the automated testing',
            paragraph: 'If this appears on the frontend, it means that teardown was not properly completed',
            mediaLink: '',
            mediaType: '',
            linkText: '',
            linkAddress: '',
            row: 0,
            column: 0
        });
    expect(res.status).toBe(200);
    item_id = res.body._id;
});

it('Edit existing item', async () => {
    const res = await global.app
        .put('/api/item')
        .set('x-auth-token', token)
        .send({
            item: item_id,
            title: 'Jest created this (edited)'
        });
    expect(res.status).toBe(200);
});

it('Edit theme of item', async () => {
    const res = await global.app
        .put('/api/item/theme')
        .set('x-auth-token', token)
        .send({
            id: item_id,
            theme: {
                primaryFontFamily: 'Roboto',
                secondaryFontFamily: 'Roboto',
                primaryColor: '#FFF',
                secondaryColor: '#FFF',
                headerBackgroundColor: '#FFF'
            }
        });
    expect(res.status).toBe(200);
})

it('Get item', async () => {
    const res = await global.app
        .get('/api/item/'+item_id)
        .set('x-auth-token', token);
    expect(res.status).toBe(200);
});

it('Delete item', async () => {
    const res = await global.app
        .delete('/api/item/'+item_id)
        .set('x-auth-token', token);
    expect(res.status).toBe(200);
});