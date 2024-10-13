#!usr/bin/node

import { initializeApp, cert } from "firebase-admin/app";
import { configDotenv } from "dotenv";
import { auth } from "firebase-admin";

configDotenv();

const serviceAccount = require(process.env.GOOGLE_SERVICE_ACCOUNT);
class FirebaseUtil {

  constructor() {
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
}

export default FirebaseUtil;

