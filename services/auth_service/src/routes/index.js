#!/usr/bin/node

import { Router } from "express";
import AppController from "../controllers/AppController";
import AuthController from "../controllers/AuthController";
import TokenVerification from "../middlewares/TokenVerification";

const router = Router();

/*App controller API endpoints*/
router.get('/status', AppController.getStatus);
router.get('/health', AppController.getHealth);

/*Auth  controller API endpoints */
router.post('/login',AuthController.login);
router.post('/firebase-login', TokenVerification.verifyFirebaseToken, AuthController.firebaseLogin);
router.post('/logout', AuthController.logout);
router.post('/verify',TokenVerification.verifyAccessToken, TokenVerification.authorizationMiddleware, 
    AuthController.verify
 );


export default router;