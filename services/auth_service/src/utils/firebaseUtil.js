#!usr/bin/node

import admin, { credential } from "firebase-admin/app";
import { configDotenv } from "dotenv";

configDotenv();

const serviceAccount = require(process.env.GOOGLE_SERVICE_ACCOUNT);
class FirebaseUtil {

  constructor() {
    admin.initializeApp({
      credential: credential.cert(serviceAccount)
    });
  }
}

export default FirebaseUtil;

