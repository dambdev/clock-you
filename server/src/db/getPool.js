import mysql from 'mysql2/promise';
import { MYSQL_DB, MYSQL_HOST, MYSQL_PASS, MYSQL_USER } from '../../env.js';

let pool;

const getPool = async () => {
    if (pool) return pool;
    
    try {
        pool = mysql.createPool({
            connectionLimit: 10,
            socketPath: '/var/run/mysqld/mysqld.sock',
            user: MYSQL_USER,
            password: MYSQL_PASS,
            database: MYSQL_DB,
            timezone: 'Z',
            waitForConnections: true,    // Añadir — espera si no hay conexiones libres
            queueLimit: 0,               // Añadir — sin límite de cola (0 = ilimitado)
            enableKeepAlive: true,       // Añadir — evita que el socket se cierre por inactividad
            keepAliveInitialDelay: 10000 // Añadir — keepalive cada 10s
        });

        // Verificar conexión al arrancar
        const conn = await pool.getConnection();
        conn.release();
        console.log('MySQL pool conectado correctamente');

    } catch (err) {
        console.error(`Error al configurar el pool de MySQL: ${err.message}`, err);
        pool = null; // Resetear para permitir reintento
        throw err;
    }

    return pool;
};

export default getPool;