/**
 * @jest-environment ./ServerEnvironment
 */

const {connectDB, disconnectDB} = require('../../server/config/db');
const firebase = require('../../client/node_modules/firebase');
const firebaseConfig = require('../../client/src/utils/firebaseConfig').firebaseConfig;

let token;

beforeAll(async () => {
    jest.setTimeout(3 * 60 * 10000);
    connectDB();
    firebase.initializeApp(firebaseConfig);
    await firebase.auth().signInWithEmailAndPassword('quaranteamjesttest@gmail.com', 'quaranteam')
    .then(async () => {
        await firebase.auth().currentUser.getIdToken(true)
        .then(function (idToken){
            token = idToken;
        });
    });
    
});

afterAll(async () => {
    await disconnectDB();
    await firebase.auth().signOut();
    await firebase.app().delete();
    // prevent open handle error
    await new Promise(resolve => setTimeout(() => resolve(), 500));
});

beforeEach(() => {
});

describe('Login sequence', () => {
    test('Check firebase frontend config with signInWithEmailAndPassword', async () => {
        firebase.auth().signOut();
        expect(await firebase.auth().signInWithEmailAndPassword('quaranteamjesttest@gmail.com', 'quaranteam')
            .then(() => {
                expect(firebase.auth().currentUser.getIdToken(true)
                .then(function (idToken){
                    token = idToken;
                })).not.toThrowError;
            })).not.toThrowError;
    });

    test('Register/login user fails without valid google auth', async () => {
        const res = await global.app.post('/api/auth/');
        expect(res.status).toBe(401);
    });
    it('Use token to register/login', async () => {
        const res = await global.app.post('/api/auth/')
            .set('x-auth-token', token)
            .send();
        expect(res.status).toBe(200);
    });
});

describe('Get user info route', () => {
    it('Get user info fails without auth', async () => {
        const res = await global.app.get('/api/auth');
        expect(res.status).toBe(401);
    });

    it('Get user info', async () => {
        const res = await global.app.get('/api/auth')
            .set('x-auth-token', token);
        expect(res.status).toBe(200);
        expect(res.body).not.toBeNull();
    });
});