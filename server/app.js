import cors from 'cors';
import morgan from 'morgan';
import routes from './src/routes/index.js';
import express from 'express';
import fileUpload from 'express-fileupload';
import socketController from './src/controllers/sockets/socketController.js';
import { UPLOADS_DIR } from './env.js';
import { createServer } from 'node:http';
import {
    notFoundErrorController,
    errorController,
} from './src/controllers/errors/index.js';

const app = express();

const server = createServer(app);

socketController(server);

app.disable('x-powered-by');

app.use(morgan('dev'));

app.use(cors());

app.use(express.static(UPLOADS_DIR));

app.use(express.json());

app.use(fileUpload());

app.use(routes);

app.use(notFoundErrorController);

app.use(errorController);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
