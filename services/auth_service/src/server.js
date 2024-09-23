#!/usr/bin/node
/**
 * The server of the authentication service
 */
import express from 'express';
import router from './routes';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import PrettyPrint from './middlewares/PrettyPrint';
import FirebaseUtil from './utils/firebaseUtil';

const firebaseUtil = new FirebaseUtil();

const app = express();

const corsOptions = {
    origin: '*', // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowable methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(PrettyPrint.printPretty);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/auth', router);
app.use('/auth', cors(corsOptions))
app.use(helmet());
app.use(morgan('tiny'));

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Auth service running on ${HOST}:${PORT}`);
});