/**
 * @jest-environment ./ServerEnvironment
 */

const {connectDB, disconnectDB} = require('../../server/config/db');
const firebase = require('../../client/node_modules/firebase');
const firebaseConfig = require('../../client/src/utils/firebaseConfig').firebaseConfig;

let token, portfolios, portfolio_id;

beforeAll(async () => {
    connectDB();
    firebase.initializeApp(firebaseConfig);
    await firebase.auth().signInWithEmailAndPassword('quaranteamjesttest@gmail.com', 'quaranteam').then(async () => {
        await firebase.auth().currentUser.getIdToken(true)
        .then(function (idToken){
            token = idToken;
        });
    });

    await global.app
        .post('/api/auth')
        .set('x-auth-token', token);
});

afterAll(async () => {
    // Get all portfolios and delete
    const res = await global.app
            .get('/api/portfolio/user')
            .set('x-auth-token', token);
    let deletePortfolios = res.body;
    deletePortfolios.forEach(async portfolio => {
        await global.app
            .delete('/api/portfolio/delete/'+portfolio._id)
            .set('x-auth-token', token);
    });
    await disconnectDB();
    await firebase.auth().signOut();
    await firebase.app().delete();
    // prevent open handle error
    await new Promise(resolve => setTimeout(() => resolve(), 500));
});

describe('Creating portfolios', ()=> {
    it('Create a portfolio without template', async () => {
        const res = await global.app
            .post('/api/portfolio')
            .set('x-auth-token', token)
            .send({
                name: 'Jest testing portfolio',
                template: 'blank',
                private: false
            });
        expect(res.status).toBe(200);
    });

    it('Create a private portfolio', async () => {
        const res = await global.app
            .post('/api/portfolio')
            .set('x-auth-token', token)
            .send({
                name: 'Jest testing portfolio',
                template: 'blank',
                private: true
            });
        expect(res.status).toBe(200);
    });
});

describe('Getting portfolios', () => {
    it('Get all user portfolios', async () => {
        const res = await global.app
            .get('/api/portfolio/user')
            .set('x-auth-token', token);
        expect(res.status).toBe(200);
        portfolios = res.body;
        portfolio_id = portfolios[1]._id;
    });

    it('Getting a portfolio by id - logged in', async () => {
        const res = await global.app
            .get('/api/portfolio/single/'+portfolio_id)
            .set('x-auth-token', token);
        expect(res.status).toBe(200);
    });

    it('Getting a portfolio by id - guest', async () => {
        // ensure that portfolio is public
        await global.app
            .put('/api/portfolio/edit')
            .set('x-auth-token', token)
            .send({
                portfolio: portfolio_id,
                field: 'privacy',
                value: false
            });
        const res = await global.app
            .get('/api/portfolio/guest/'+portfolio_id)
        expect(res.status).toBe(200);
    });

    // TODO: Please edit this after fixing images
    it.skip('Getting thumbnail of portfolio by id', async () => {
        const res = await global.app
            .get('/api/portfolio/thumnail/'+portfolio_id)
            .set('x-auth-token', token);
        expect(res.status).toBe(200);
    });
});

describe('Edit portfolio', () => {
    it('Edit name of portfolio', async () => {
        const res = await global.app
            .put('/api/portfolio/edit')
            .set('x-auth-token', token)
            .send({
                portfolio: portfolio_id,
                field: 'name',
                value: 'This is a changed name'
            });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('This is a changed name');
    });

    it('Edit privacy of portfolio', async () => {
        const res = await global.app
            .put('/api/portfolio/edit')
            .set('x-auth-token', token)
            .send({
                portfolio: portfolio_id,
                field: 'privacy',
                value: true
            });
        expect(res.status).toBe(200);
        expect(res.body.private).toBe(true);
    });

    it('Add permission to users to view private portfolio', async () => {
        const res = await global.app
            .put('/api/portfolio/permission')
            .set('x-auth-token', token)
            .send({
                portfolio: portfolio_id,
                add: true,
                email: 'juweytan@gmail.com'
            });
        expect(res.status).toBe(200);
    });

    it('Remove permission to users to view private portfolio', async () => {
        const res = await global.app
            .put('/api/portfolio/permission')
            .set('x-auth-token', token)
            .send({
                portfolio: portfolio_id,
                add: false,
                email: 'juweytan@gmail.com'
            });
        expect(res.status).toBe(200);
    });

    it('Add/edit social media link', async () => {
        const res = await global.app
            .put('/api/portfolio/socialmedia')
            .set('x-auth-token', token)
            .send({
                portfolio: portfolio_id,
                facebook: 'www.facebook.com',
                instagram: 'www.instagram.com',
                twitter: 'www.twitter.com',
                linkedin: 'www.linkedin.com'
            });
        expect(res.status).toBe(200);
    });

    it('Edit theme of portfolioo', async () => {
        const res = await global.app
            .put('/api/portfolio/theme')
            .set('x-auth-token', token)
            .send({
                id: portfolio_id,
                theme: {
                    primaryFontFamily: 'Roboto',
                    secondaryFontFamily: 'Roboto',
                    primaryColor: '#FFF',
                    secondaryColor: '#FFF',
                    headerBackgroundColor: '#FFF'
                }
            });
        expect(res.status).toBe(200);
    });
})



describe('Templating', () => {
    let templates;
    it ('Get templates', async () => {
        const res = await global.app.get('/api/portfolio/templates');
        expect(res.status).toBe(200);
        templates = res.body;
    });

    it('Create portfolio with template', async ()=> {
        const res = await global.app
            .post('/api/portfolio/')
            .set('x-auth-token', token)
            .send({
                name: 'Jest testing portfolio',
                template: templates[0]._id,
                private: false
            });
        expect(res.status).toBe(200);
    });
});

it('Deleting a portfolio', async () => {
    // create portfolio to delete so it doesn't interfere with tests
    let portfolio_id;
    const createRes = await global.app
        .post('/api/portfolio')
        .set('x-auth-token', token)
        .send({
            name: 'Jest testing portfolio',
            template: 'blank',
            private: false
        });

    portfolio_id = createRes.body._id;

    const res = await global.app
        .delete('/api/portfolio/delete/'+portfolio_id)
        .set('x-auth-token', token);
    expect(res.status).toBe(202);
})