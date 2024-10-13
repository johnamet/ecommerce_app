import jwt from 'jsonwebtoken';

class TokenUtil {
    /**
     * Creates a signed JWT access token.
     * @param {object} payload - Payload for the token.
     * @returns {string} - Signed JWT access token.
     */
    static createAccessToken(payload) {
        try {
            return jwt.sign(payload, process.env.JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '1h'
            });
        } catch (error) {
            console.error('Error creating access token:', error);
            throw new Error('Token creation failed');
        }
    }

    /**
     * Creates a signed JWT refresh token.
     * @param {object} payload - Payload for the token.
     * @returns {string} - Signed JWT refresh token.
     */
    static createRefreshToken(payload) {
        try {
            payload.type = 'refresh';
            return jwt.sign(payload, process.env.JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '30d'
            });
        } catch (error) {
            console.error('Error creating refresh token:', error);
            throw new Error('Token creation failed');
        }
    }

    /**
     * Verifies a JWT token.
     * @param {string} token - Token to verify.
     * @returns {object} - Decoded token payload.
     */
    static verifyToken(token) {
        if (!token) {
            throw new Error('No token provided');
        }

        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token');
            } else {
                throw new Error('Token verification failed');
            }
        }
    }
}

export default TokenUtil;
