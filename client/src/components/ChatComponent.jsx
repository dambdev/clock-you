import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { VITE_API_URL } from '../../env.local.js';
import { useState, useEffect } from 'react';

const ChatComponent = ({ user }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');

    const location = useLocation();

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message === '')
            toast.error('El mensaje no puede estar vacío', { id: 'error' });
        else if (socket) {
            socket.emit(
                'chatMessage',
                message,
                user.firstName,
                user.lastName,
                new Date().toLocaleTimeString(),
                socket.auth.serverOffset
            );
            setMessage('');
        }
    };

    useEffect(() => {
        const newSocket = io(VITE_API_URL, {
            auth: {
                serverOffset: 0,
            },
        });
        setSocket(newSocket);

        newSocket.on(
            'chatMessage',
            (message, firstName, lastName, time, serverOffset) => {
                const textarea = document.getElementById(`messages-${user.id}`);
                textarea.value += `${firstName} ${lastName}
${time}: ${message}
\n`;
                textarea.scrollTop = textarea.scrollHeight;
                newSocket.auth.serverOffset = serverOffset;
            }
        );

        return () => {
            newSocket.off('connect');
            newSocket.off('chatMessage');
            newSocket.disconnect();
            setSocket(null);
        };
    }, [location]);

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <textarea
                    className='mt-4 mb-2'
                    id={`messages-${user.id}`}
                    rows={10}
                    readOnly
                ></textarea>
                <input
                    type='text'
                    name='message'
                    id='message'
                    maxLength='500'
                    placeholder='Escribe aquí tu mensaje'
                    value={message}
                    onChange={handleMessageChange}
                />
                <div className='mx-auto'>
                    <button className='mr-4' type='submit'>
                        Enviar
                    </button>
                </div>
            </fieldset>
        </form>
    );
};

export default ChatComponent;

ChatComponent.propTypes = {
    user: PropTypes.object,
};
