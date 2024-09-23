#!/usr/bin/node
import admin from 'firebase-admin';
import cache from '../utils/redisUtil';
import TokenUtil from '../utils/tokensUtil';

class AuthController {

    static async login(req, res) {
        const body = req.body;

        const {email, uid} = body;

        if (!email || !uid) {
            return res.status(401).send({
                error: "Unauthorized Error.",
                message: "No email, uid, or verification status provided."
            });
        }

        try {
            const user = await admin.auth().getUserByEmail(email);

            if (user) {
                const payload = { uid, email, role };

                const accessToken = TokenUtil.createAccessToken(payload);
                const refreshToken = TokenUtil.createRefreshToken(payload);

                return res.status(200).send({
                    accessToken,
                    refreshToken
                });
            }

            return res.status(401).send({
                error: "Unauthorized error.",
                message: "Invalid credentials."
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).send({
                error: "Internal Server Error.",
                message: "An error occurred while processing your request."
            });
        }
    }

    static async firebaseLogin(req, res){
        const uid = req.uid;
        const role = req.role;
        const email = req.email;
        const email_verified = req.email_verified;

        try {
            const payload = {uid, role, email, email_verified};

            const accessToken = TokenUtil.createAccessToken(payload);
            const refreshToken = TokenUtil.createRefreshToken(payload);

            return res.status(201).send({
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                error: "Internal Server Error",
                message: `An error occcured while processing your request. ${error.message}`
            });
        }
       



    }

    static async logout(req, res){
        const refreshToken = req.headers.refreshToken;
        const accessToken = req.headers.authorisation?.split("Bearer ")[1];

        if(!refreshToken){
            return res.status(401).send({
                error: "Unauthorised error.",
                message: "No refresh token found to refresh access\
                 token. Please login again. or make a new request with refreshToken"
            });
        }

        try{
            await cache.set(`invalidated-${accessToken}`, accessToken)
            await cache.set(`invalidated-${refreshToken}`, refreshToken);
            return res.status(201).send({
                message: "Logout successful"
            });
        }catch(error){
            return res.status(500).send({
                error: "Internal Error",
                message: "Something went wrong"
            });
        }
    }

    static async verify(req, res){
        const email = req.email;
        const uid = req.uid;
        const accessToken = req.headers.authorisation?.split("Bearer ")[1];

        return res.status(201).send({
            message: "Token verified",
            uid,
            email,
            accessToken
        });
    }

    static async registerUser(req, res){
        const body = req.body();

        const {email, password, token} = body;

        if (!email || !password  || !token){
            return res.status(400).send({
                error: "Insufficient credentials"
            });
        }

        //Todo: use user service to register users 
    }
}

export default AuthController;
