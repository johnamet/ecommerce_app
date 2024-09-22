#!/usr/bin/node
import { configDotenv } from 'dotenv';
import admin, { auth } from 'firebase-admin';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import cache from '../utils/redisUtil';

configDotenv();

class TokenVerification{

    /**
     * Verifies firebase authentication token.
     * @param {object} req - An express request object
     * @param {object} res - An express response object
     * @param {Function} next - An express next function
     * @returns {Response} - An express response.
     */
    static async verifyFirebaseToken(req, res, next){
        const firebaseToken = req.headers.authorisation?.split("Bearer ")[1];

        if(!firebaseToken){
            return res.status(401).send({
                error: "Unauthorised error. No valid firebase \
                token has been provided"
            });
        }

        try{
            const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        
            const {email, uid, email_verified} = decodedToken.
            req.uid = uid;
            req.email = email;
            req.email_verified;
            next();
        }catch(error){
            console.error(`Failed to verify firebase token. Error:
                ${error}`);

            return res.status(401).send({
                error: "Unauthorised error. There was an error verifying\
                 firebase token.",
                message: error.message
            });
        }
        
    }

    /**
     * Verifies the access token passed with the token.
     * @param {object} req - An express request object
     * @param {object} res - An express response object
     * @param {Function} next - An express next function
     * @returns {Response} - An express response
     */
    static async verifyAccessToken(req, res, next) {
        const accessToken = req.headers.authorization?.split("Bearer ")[1];
    
        if (!accessToken) {
            return res.status(401).json({
                error: "Unauthorized Error.",
                message: "No access token was provided."
            });
        }
    
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.uid = decoded.uid;
            req.role = decoded.role;
            req.email = decoded.email;
            req.verified = true;
            return next();
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                const cachedAccessToken = await cache.get(`cached-${accessToken}`);
                if (cachedAccessToken) {
                    req.authorization = `Bearer ${cachedAccessToken}`;
                    return this.verifyAccessToken(req, res, next);
                }
                req.verified = false;
                return next();
            }
    
            return res.status(401).json({
                error: "Unauthorized error.",
                message: "Provided credentials invalid."
            });
        }
    }
    
    /**
     * Verifies the refresh token passed with the token.
     * @param {object} req - An express request object
     * @param {object} res - An express response object
     * @param {Function} next - An express next function
     * @returns {Response} - An express response
     */
    static async verifyRefreshToken(req, res, next){

        if(req.verified === true && req.uid){
            return next();
        }

        const refreshToken = req.headers.refreshToken;

        if (!refreshToken){
            return res.status(401).send({
                error: "Unauthorised error.",
                message: "No refresh token found to refresh access\
                 token. Please login again. or make a new request with refreshToken"
            });
        }

        try{
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
            req.decodeData = decodedRefreshToken;
            return next();
        }catch(error){
            return res.status(401).send({
                error: "Unauthorised error.",
                message: "Invalid refresh token."
            });
        }
    }

    static async authorizationMiddleware(req, res, next){
        TokenVerification.verifyAccessToken(req, res, next); // First try to verify access token

        if (req.verified) {
            return next(); // Access token is valid, proceed to the next route
        }
    
        // Handle access token expiration logic here
        const refreshToken = req.headers.refreshToken;
    
        if (!refreshToken) {
            return res.status(401).send({
                error: "Unauthorized error.",
                message: "No refresh token provided."
            });
        }
    
        try {
            const cachedAccessToken = await cache.get(`cached-${req.headers.authorization}`);
            if (cachedAccessToken) {
                req.authorization = `Bearer ${cachedAccessToken}`;
                return next(); // Use cached access token
            }
    
            TokenVerification.verifyRefreshToken(req, res, next); // Verify refresh token
            const newAccessToken = jwt.sign({
                uid: req.decodeData.uid,
                role: req.decodeData.role,
                email: req.decodeData.email
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            // Cache the new access token
            await cache.set(`cached-${newAccessToken}`, newAccessToken);
            req.authorization = `Bearer ${newAccessToken}`; // Attach new token
            req.uid = req.decodeData.uid; // Attach user data
            req.role = req.decodeData.role;
            req.email = req.decodeData.email;
    
            return next(); // Continue to the next route
        } catch (error) {
            return res.status(401).send({
                error: "Unauthorized error.",
                message: "Invalid refresh token."
            });
        }
    }
}

export default TokenVerification;