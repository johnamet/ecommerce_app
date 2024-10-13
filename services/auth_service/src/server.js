import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import PrettyPrint from './middlewares/PrettyPrint';
import FirebaseUtil from './utils/firebase';
import generalRoutes from './routes';
import authRoutes from './routes/auth';


// const file = './docs/swagger.yaml';


// const swaggerUi = require('swagger-ui-express');
// const yamljs = require('yamljs');
// const swaggerDocument = yamljs.load(file);

const app = express();


// Use swagger-ui-express middleware to serve your Swagger docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Security and logging middlewares
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(helmet());
app.use(morgan('tiny'));

// Pretty-print responses
app.use(PrettyPrint.printPretty);

// Parsing middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase once
new FirebaseUtil();

// Define routes
app.use('/auth', authRoutes);
app.use('/', generalRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Auth service running on ${HOST}:${PORT}`);
});

export default app;
