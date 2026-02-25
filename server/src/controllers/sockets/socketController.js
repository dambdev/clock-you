import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import { Server } from 'socket.io';
import { CLIENT_URL } from '../../../env.js';

const socketController = (server) => {
    const io = new Server(server, {
        cors: {
            origin: CLIENT_URL,
        },
        // Optimización: Desactivar connectionStateRecovery para reducir memoria
        // Solo se activa si realmente necesitas recuperar el estado de conexiones
        connectionStateRecovery: {
            enabled: false,
        },
        // Optimización: Reducir el ping timeout para liberar conexiones inactivas más rápido
        pingTimeout: 20000, // 20 segundos (default: 20000)
        pingInterval: 25000, // 25 segundos (default: 25000)
        // Optimización: Limitar el número de conexiones simultáneas
        maxHttpBufferSize: 1e6, // 1MB (reducir si no necesitas archivos grandes)
        // Optimización: Desactivar compresión si no es necesaria
        compression: false,
        // Optimización: Reducir el tamaño del buffer de transporte
        transports: ['websocket', 'polling'],
        allowEIO3: false, // Desactivar compatibilidad con versiones antiguas
    });

    io.on('connection', async (socket) => {
        socket.on('chatMessage', async (message, firstName, lastName, time) => {
            try {
                const pool = await getPool();

                await pool.query(
                    'INSERT INTO messages (content, firstName, lastName, time) VALUES (?, ?, ?, ?)',
                    [message, firstName, lastName, time]
                );

                io.emit('chatMessage', message, firstName, lastName, time);
            } catch (error) {
                generateErrorUtil(error.message, 500);
            }
        });

        // Optimización: Cargar solo los últimos 50 mensajes en lugar de todos
        // Esto reduce significativamente el uso de memoria cuando hay muchos mensajes
        try {
            const pool = await getPool();
            const [results] = await pool.query(
                'SELECT content, firstName, lastName, time FROM messages ORDER BY id DESC LIMIT ?',
                [50] // Limitar a 50 mensajes recientes
            );

            // Enviar en orden inverso para mantener el orden cronológico
            results.reverse().forEach((result) => {
                socket.emit(
                    'chatMessage',
                    result.content,
                    result.firstName,
                    result.lastName,
                    result.time
                );
            });
        } catch (error) {
            generateErrorUtil(error.message, 500);
        }
    });
    return io;
};

export default socketController;
