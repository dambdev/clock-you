import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';

import { createServer } from 'node:http';
import { CLIENT_URL, NODE_ENV, PORT, UPLOADS_DIR } from './env.js';
import {
    errorController,
    notFoundErrorController,
} from './src/controllers/errors/index.js';
import socketController from './src/controllers/sockets/socketController.js';
import routes from './src/routes/index.js';

const app = express();

const server = createServer(app);

const corsOptions = {
    origin: CLIENT_URL,
    allowedHeaders: 'Content-Type',
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, PATCH',
};

const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev'

socketController(server);

app.disable('x-powered-by');

app.use(morgan(morganFormat));

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
