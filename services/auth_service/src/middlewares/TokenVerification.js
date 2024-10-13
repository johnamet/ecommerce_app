import admin from 'firebase-admin';
import TokenUtil from '../utils/tokensUtil';

class TokenVerification {
    /**
     * Verifies Firebase ID token from the request.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Response|void} - Returns error or proceeds to the next middleware.
     */
    static async verifyFirebaseToken(req, res, next) {
        const firebaseToken = req.headers.authorization?.split("Bearer ")[1];

        if (!firebaseToken) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "No Firebase token provided."
            });
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
            req.uid = decodedToken.uid;
            req.email = decodedToken.email;
            req.email_verified = decodedToken.email_verified;
            req.role = decodedToken.role || null;
            next();
        } catch (error) {
            console.error('Error verifying Firebase token:', error);
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid Firebase token."
            });
        }
    }

    /**
     * Middleware to verify JWT access token.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Response|void} - Returns error or proceeds to next middleware.
     */
    static authorizationMiddleware(req, res, next) {
        const accessToken = req.headers.authorization?.split("Bearer ")[1];

        if (!accessToken) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Access token not provided."
            });
        }

        try {
            const decoded = TokenUtil.verifyToken(accessToken);
            req.decoded = decoded;
            next();
        } catch (error) {
            console.error('Error verifying access token:', error);
            return res.status(401).json({
                error: "Unauthorized",
                message: error.message || 'Invalid access token.'
            });
        }
    }
}

export default TokenVerification;
