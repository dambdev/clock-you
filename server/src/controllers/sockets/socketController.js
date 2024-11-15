import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import { Server } from 'socket.io';
import { CLIENT_URL } from '../../../env.js';

const socketController = (server) => {
    const io = new Server(server, {
        cors: {
            origin: CLIENT_URL,
        },
        connectionStateRecovery: {
            fullRecovery: true,
            recoveryTimeout: 60000,
        },
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

        if (!socket.recovered) {
            try {
                const pool = await getPool();
                const [results] = await pool.query(
                    'SELECT content, firstName, lastName, time FROM messages WHERE id > ?',
                    [socket.handshake.auth.serverOffset || 0]
                );
                results.forEach((result) => {
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
        }
    });
    return io;
};

export default socketController;
