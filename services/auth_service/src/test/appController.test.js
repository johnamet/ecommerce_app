import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from './server';
import admin from 'firebase-admin';
import cache from './utils/redis';
import TokenUtil from './utils/tokensUtil';

const { expect } = chai;
chai.use(chaiHttp);

describe('AuthController Tests', () => {
    let sandbox;
 
    beforeEach(() => {
        sandbox = sinon.createSandbox(); // Create a new sandbox before each test
    });

    afterEach(() => {
        sandbox.restore(); // Restore the sandbox after each test
    });

    describe('authorise()', () => {
        it('should authorize a user with valid email and verified status', async () => {
            // Stub Firebase and TokenUtil
            sandbox.stub(admin.auth(), 'getUserByEmail').resolves({ uid: 'testUid', email: 'test@example.com' });
            sandbox.stub(TokenUtil, 'createAccessToken').returns('testAccessToken');
            sandbox.stub(TokenUtil, 'createRefreshToken').returns('testRefreshToken');

            const reqBody = {
                email: 'test@example.com',
                uid: 'testUid',
                email_verified: true
            };

            const res = await chai.request(app)
                .post('/auth/authorize')
                .send(reqBody);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('accessToken', 'testAccessToken');
            expect(res.body).to.have.property('refreshToken', 'testRefreshToken');
        });

        it('should return 401 if email is not verified', async () => {
            const reqBody = {
                email: 'test@example.com',
                uid: 'testUid',
                email_verified: false
            };

            const res = await chai.request(app)
                .post('/auth/authorize')
                .send(reqBody);

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error', 'Unauthorized');
            expect(res.body).to.have.property('message', 'Email verification is required.');
        });

        it('should return 500 on Firebase error', async () => {
            sandbox.stub(admin.auth(), 'getUserByEmail').rejects(new Error('Firebase error'));

            const reqBody = {
                email: 'test@example.com',
                uid: 'testUid',
                email_verified: true
            };

            const res = await chai.request(app)
                .post('/auth/authorize')
                .send(reqBody);

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('error', 'Server Error');
            expect(res.body).to.have.property('message', 'Internal server error occurred.');
        });
    });

    describe('logout()', () => {
        it('should logout user and remove refresh token from Redis', async () => {
            sandbox.stub(cache, 'del').resolves(true);

            const reqBody = {
                refreshToken: 'validRefreshToken'
            };

            const res = await chai.request(app)
                .post('/auth/logout')
                .send(reqBody);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Successfully logged out.');
        });

        it('should return 400 for missing refresh token', async () => {
            const res = await chai.request(app)
                .post('/auth/logout')
                .send({});

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error', 'Bad Request');
            expect(res.body).to.have.property('message', 'Refresh token is required.');
        });

        it('should return 400 for invalid refresh token', async () => {
            sandbox.stub(cache, 'del').resolves(false);

            const reqBody = {
                refreshToken: 'invalidRefreshToken'
            };

            const res = await chai.request(app)
                .post('/auth/logout')
                .send(reqBody);

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error', 'Bad Request');
            expect(res.body).to.have.property('message', 'Invalid refresh token.');
        });
    });

    describe('refreshToken()', () => {
        it('should refresh access token using valid refresh token', async () => {
            sandbox.stub(cache, 'get').resolves('validRefreshToken');
            sandbox.stub(TokenUtil, 'verifyToken').returns({ uid: 'testUid', email: 'test@example.com', email_verified: true });
            sandbox.stub(TokenUtil, 'createAccessToken').returns('newAccessToken');

            const reqBody = {
                refreshToken: 'validRefreshToken'
            };

            const res = await chai.request(app)
                .post('/auth/refresh-token')
                .send(reqBody);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('accessToken', 'newAccessToken');
        });

        it('should return 401 for invalid or expired refresh token', async () => {
            sandbox.stub(cache, 'get').resolves(null);

            const reqBody = {
                refreshToken: 'invalidRefreshToken'
            };

            const res = await chai.request(app)
                .post('/auth/refresh-token')
                .send(reqBody);

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error', 'Unauthorized');
            expect(res.body).to.have.property('message', 'Invalid or expired refresh token.');
        });
    });

    describe('verify()', () => {
        it('should verify a valid access token', async () => {
            sandbox.stub(TokenUtil, 'verifyToken').returns({ uid: 'testUid', email: 'test@example.com', email_verified: true });

            const res = await chai.request(app)
                .get('/auth/verify')
                .set('Authorization', 'Bearer validAccessToken');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Access token is valid.');
            expect(res.body).to.have.property('user');
        });

        it('should return 401 for missing access token', async () => {
            const res = await chai.request(app)
                .get('/auth/verify')
                .set('Authorization', '');

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error', 'Unauthorized');
            expect(res.body).to.have.property('message', 'Access token is required.');
        });

        it('should return 401 for invalid access token', async () => {
            sandbox.stub(TokenUtil, 'verifyToken').throws(new Error('Invalid access token'));

            const res = await chai.request(app)
                .get('/auth/verify')
                .set('Authorization', 'Bearer invalidAccessToken');

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error', 'Unauthorized');
            expect(res.body).to.have.property('message', 'Invalid access token.');
        });
    });
});
