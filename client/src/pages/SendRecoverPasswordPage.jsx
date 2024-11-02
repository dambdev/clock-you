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
        try {
            e.preventDefault();

            const data = await fetchSendRecoverPasswordUserServices(email);
            toast.success(data, {
                id: 'ok',
            });

            delayedNavigation('/password');
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };
    return (
        <form className='mx-auto' onSubmit={handleRecover}>
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
