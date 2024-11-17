import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSendRecoverPasswordUserServices } from '../services/userServices.js';

const SendRecoverPasswordPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const resetInputs = (e) => {
        e.preventDefault();
        setEmail('');
    };

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    const handleRecover = async (e) => {
        e.preventDefault();
        toast.promise(fetchSendRecoverPasswordUserServices(email), {
            loading: 'Enviando correo...',
            success: (response) => {
                delayedNavigation('/password');
                return <b>{response}</b>;
            },
            error: (error) => {
                return <b>{error.message}</b>;
            },
        });
    };
    return (
        <form onSubmit={handleRecover}>
            <fieldset>
                <legend>Recuperar contraseña</legend>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Escribe aquí tu email'
                    required
                />
                <div className='mx-auto'>
                    <button className='mr-4' type='submit'>
                        Recuperar
                    </button>
                    <button onClick={resetInputs}>Limpiar</button>
                </div>
            </fieldset>
        </form>
    );
};
export default SendRecoverPasswordPage;
