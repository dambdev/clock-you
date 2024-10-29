import mysql from 'mysql2/promise';
import url from 'url';

import { JAWSDB_URL } from '../../env.js';

const dbUrl = JAWSDB_URL;
const connectionParams = url.parse(dbUrl);
const [username, password] = connectionParams.auth.split(':');

let pool;

const getPool = async () => {
    try {
        if (!pool) {
            pool = mysql.createPool({
                host: connectionParams.hostname,
                user: username,
                password: password,
                database: connectionParams.pathname.substring(1),
                port: connectionParams.port || 3306,
                connectionLimit: 10,
                timezone: 'Z',
            });
        }

        return pool;
    } catch (err) {
        console.error(
            `Error al configurar el pool de MySQL: ${err.message}`,
            err
        );
        throw err;
    }
};

export default getPool;
