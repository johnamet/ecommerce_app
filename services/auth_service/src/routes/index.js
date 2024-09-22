#!/usr/bin/node

import { Router } from "express";
import AppController from "../controllers/AppController";

const router = Router();

/*App controller API endpoints*/
router.get('/status', AppController.getStatus);
router.get('/health', AppController.getHealth);

export default router;