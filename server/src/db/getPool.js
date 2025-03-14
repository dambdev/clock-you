import mysql from 'mysql2/promise';
import { MYSQL_DB, MYSQL_HOST, MYSQL_PASS, MYSQL_USER } from '../../env.js';

let pool;

const getPool = async () => {
    try {
        if (!pool) {
            pool = mysql.createPool({
            });

            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DB,
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
