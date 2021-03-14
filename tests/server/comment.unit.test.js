/**
 * @jest-environment ./ServerEnvironment
 */

const {connectDB, disconnectDB} = require('../../server/config/db');
const firebase = require('../../client/node_modules/firebase');
const firebaseConfig = require('../../client/src/utils/firebaseConfig').firebaseConfig;

let token, portfolio_id, item_id, comment_id;

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
    const portfolioRes = await global.app
        .post('/api/portfolio/')
        .set('x-auth-token', token)
        .send({
            name: 'Jest testing page portfolio',
            template: 'blank',
            private: false
        });

    portfolio_id = portfolioRes.body._id;

    const itemRes = await global.app
        .post('/api/item')
        .set('x-auth-token', token)
        .send({
            portfolio: portfolio_id,
            pagename: 'Home',
            private: false,
            title: 'Jest created this to test comments on it',
            subtitle: 'This is part of the automated testing',
            paragraph: 'If this appears on the frontend, it means that teardown was not properly completed',
            mediaLink: '',
            mediaType: '',
            linkText: '',
            linkAddress: '',
            row: 0,
            column: 0
        });
    item_id = itemRes.body._id;
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

it('Create a comment on item', async () => {
    const res = await global.app
        .post('/api/comment/'+item_id)
        .set('x-auth-token', token)
        .send({
            text: 'This is a comment created in Jest testing. If it can be seen in frontend, teardown was not properly done'
        });
    expect(res.status).toBe(200);
    comment_id = res.body._id;
});

it('Get all comments on an item', async () => {
    const res = await global.app
        .get('/api/comment/'+item_id);
    expect(res.status).toBe(200);
});

it('Edit a comment', async () => {
    const res = await global.app
        .post('/api/comment/edit/'+comment_id)
        .set('x-auth-token', token)
        .send({
            text: 'This comment was edited in Jest testing. If it can be seen in frontend, teardown was not properly done'
        });
    expect(res.status).toBe(200);
});

it('Delete the comment', async () => {
    const res = await global.app
        .delete('/api/comment/'+comment_id)
        .set('x-auth-token', token);
    expect(res.status).toBe(200);
});