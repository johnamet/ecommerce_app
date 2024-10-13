import admin from 'firebase-admin';
import cache from '../utils/redis';
import TokenUtil from '../utils/tokensUtil';

class AuthController {
    /**
     * Authorizes a user using Firebase Authentication and generates JWT tokens.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @returns {Promise<Response>} - Returns access and refresh tokens if authorized.
     */
    static async authorise(req, res) {
        const { email, uid, email_verified } = req;

        // Validate required fields
        if (!email || !uid || email_verified === undefined) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Missing email, uid, or verification status."
            });
        }

        // Check if the email is verified
        if (!email_verified) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Email verification is required."
            });
        }

        try {
            // Fetch user from Firebase by email
            const user = await admin.auth().getUserByEmail(email);
            if (user) {
                // Create JWT tokens
                const payload = { uid, email, email_verified };
                const accessToken = TokenUtil.createAccessToken(payload);
                const refreshToken = TokenUtil.createRefreshToken(payload);

                await cache.set(refreshToken, refreshToken, 60*60*30);

                return res.status(200).json({ accessToken, refreshToken });
            } else {
                return res.status(401).json({
                    error: "Unauthorized",
                    message: "Invalid credentials."
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({
                error: "Server Error",
                message: "Internal server error occurred."
            });
        }
    }

    /**
     * Logs out a user by invalidating their refresh token in Redis.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @returns {Promise<Response>} - Returns success message if logged out.
     */
    static async logout(req, res) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Refresh token is required."
            });
        }

        try {
            // Invalidate the refresh token by removing it from Redis
            const deleted = await cache.del(refreshToken);
            if (deleted) {
                return res.status(200).json({
                    message: "Successfully logged out."
                });
            } else {
                return res.status(400).json({
                    error: "Bad Request",
                    message: "Invalid refresh token."
                });
            }
        } catch (error) {
            console.error('Error during logout:', error);
            return res.status(500).json({
                error: "Server Error",
                message: "Internal server error occurred."
            });
        }
    }

    /**
     * Refreshes a user's access token using the provided refresh token.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @returns {Promise<Response>} - Returns a new access token if valid.
     */
    static async refreshToken(req, res) {
        const refreshToken  = req.headers.refreshtoken;

        if (!refreshToken) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Refresh token is required."
            });
        }

        try {
            // Verify the refresh token in Redis
            const cachedToken = await cache.get(refreshToken);

            if (!cachedToken) {
                return res.status(401).json({
                    error: "Unauthorized",
                    message: "Invalid or expired refresh token."
                });
            }

            // Decode the refresh token
            const decoded = TokenUtil.verifyToken(refreshToken);

            // Create a new access token
            const payload = { uid: decoded.uid, email: decoded.email, email_verified: decoded.email_verified };
            const newAccessToken = TokenUtil.createAccessToken(payload);

            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            console.error('Error refreshing token:', error);
            return res.status(500).json({
                error: "Server Error",
                message: "Internal server error occurred."
            });
        }
    }

    /**
     * Verifies the JWT access token provided in the request.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @returns {Promise<Response>} - Returns success message if token is valid.
     */
    static async verify(req, res) {
        const accessToken = req.headers.authorization?.split("Bearer ")[1];

        if (!accessToken) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Access token is required."
            });
        }

        try {
            // Verify the access token
            const decoded = TokenUtil.verifyToken(accessToken);
            return res.status(200).json({
                message: "Access token is valid.",
                user: decoded
            });
        } catch (error) {
            console.error('Error verifying token:', error);
            return res.status(401).json({
                error: "Unauthorized",
                message: error.message || "Invalid access token."
            });
        }
    }
}

export default AuthController;
