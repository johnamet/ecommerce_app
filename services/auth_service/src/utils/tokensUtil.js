#!/usr/bin/node

import { configDotenv } from 'dotenv';


configDotenv();

class TokenUtil{

    /**
     * Generates a jwt authorization access token.
     * @param {Object} payload - The payload to create the token
     * @returns {String} - A signed access token
     */
    static createAccessToken(payload){

        try {
            const token = jwt.sign(payload, process.env.JWT_SECRET,
                 {algorithm: 'HS256', expiresIn: "1h"});
    
            return token;   
        } catch (error) {
            console.error(`Failed to generate accesstoken. Error: ${error}`);
        }
    }

    /**
     * Generates a jwt authorization refresh token.
     * @param {Object} payload - The payload to create the token
     * @returns {String} - A signed refresh token
     */
    static createRefreshToken(payload){
        payload['type'] = 'refresh';

        try {
            const token = jwt.sign(payload, process.env.JWT_SECRET,
                 {algorithm: 'HS256', expiresIn: "30d"});
    
            return token;   
        } catch (error) {
            console.error(`Failed to generate refresh token. Error: ${error}`);
        }
    }
}

export default TokenUtil;