#!/usr/bin/node
/**
 * The server of the authentication service
 */
import express from 'express';
import router from './routes';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

const corsOptions = {
    origin: '*', // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowable methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        if (typeof body === 'object') {
            body = JSON.stringify(body, null, 2); // Pretty-print with 4 spaces
            res.setHeader('Content-Type', 'application/json');
        }
        originalSend.call(this, body);
    };
    next();
});


app.use(express.json());

app.use('/auth', router);
app.use('/auth', cors(corsOptions))
app.use(helmet());
app.use(morgan('tiny'));

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Auth service running on ${HOST}:${PORT}`);
});