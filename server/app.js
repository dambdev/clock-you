import cors from 'cors';
import morgan from 'morgan';
import routes from './src/routes/index.js';
import express from 'express';
import fileUpload from 'express-fileupload';
import socketController from './src/controllers/sockets/socketController.js';
import cookieParser from 'cookie-parser';
import { UPLOADS_DIR, CLIENT_URL, PORT } from './env.js';
import { createServer } from 'node:http';
import {
    notFoundErrorController,
    errorController,
} from './src/controllers/errors/index.js';

const app = express();

const server = createServer(app);

const corsOptions = {
    origin: CLIENT_URL,
    allowedHeaders: 'Content-Type',
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, PATCH',
};

socketController(server);

app.disable('x-powered-by');

app.use(morgan('dev'));

app.use(cors(corsOptions));

app.use(express.static(UPLOADS_DIR));

app.use(express.json());

app.use(fileUpload());

app.use(cookieParser());

app.use(routes);

app.use(notFoundErrorController);

app.use(errorController);

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
