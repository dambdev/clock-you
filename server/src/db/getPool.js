import mysql from 'mysql2/promise';
import { MYSQL_DB, MYSQL_HOST, MYSQL_PASS, MYSQL_USER } from '../../env.js';

// Promesa del pool ya comprobado: las llamadas que llegan mientras se crea
// comparten el mismo intento en vez de recibir un pool sin verificar.
let poolPromise = null;

const createPool = async () => {
    const pool = mysql.createPool({
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

    try {
        // Verificar conexión al arrancar
        const conn = await pool.getConnection();
        conn.release();
        console.log('MySQL pool conectado correctamente');
        return pool;
    } catch (err) {
        console.error(`Error al configurar el pool de MySQL: ${err.message}`, err);
        // Cerrar el pool fallido: si solo se descarta, queda abierto.
        await pool.end().catch(() => {});
        throw err;
    }
};

const getPool = () => {
    if (!poolPromise) {
        poolPromise = createPool().catch((err) => {
            poolPromise = null; // Resetear para permitir reintento
            throw err;
        });
    }
    return poolPromise;
};

export default getPool;
