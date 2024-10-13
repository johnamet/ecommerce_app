#!/usr/bin/node

import { Router } from "express";
import AuthController from "../controllers/AuthController";
import TokenVerification from "../middlewares/TokenVerification";

const router = Router();

router.post('/login', TokenVerification.verifyFirebaseToken, AuthController.authorise);
router.get('/verify', TokenVerification.authorizationMiddleware, AuthController.verify);
router.get('/refresh', AuthController.refreshToken );

const authRouter = router;

export default authRouter;