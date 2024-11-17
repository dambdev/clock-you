import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChangePasswordUserServices } from '../services/userServices.js';

const ChangeRecoverPasswordPage = () => {
    const navigate = useNavigate();

    const [recoverPasswordCode, setRecoverPasswordCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');

    const resetInputs = (e) => {
        e.preventDefault();
        setRecoverPasswordCode('');
        setNewPassword('');
        setRepeatedPassword('');
    };

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    const handleChangeRecoverPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== repeatedPassword) {
            toast.error('¡Las contraseñas no coinciden!');
        } else {
            toast.promise(
                fetchChangePasswordUserServices(
                    recoverPasswordCode,
                    newPassword
                ),
                {
                    loading: 'Cambiando contraseña...',
                    success: (response) => {
                        delayedNavigation('/login');
                        return <b>{response}</b>;
                    },
                    error: (error) => {
                        return <b>{error.message}</b>;
                    },
                }
            );
        }
    };

    return (
        <form onSubmit={handleChangeRecoverPassword}>
            <fieldset>
                <legend>Nueva Contraseña</legend>
                <label htmlFor='recoverCode'>Código recuperación</label>
                <input
                    type='text'
                    id='recoverPasswordCode'
                    value={recoverPasswordCode}
                    onChange={(e) => setRecoverPasswordCode(e.target.value)}
                    placeholder='Escribe aquí el código recibido'
                    required
                />

                <label htmlFor='password'>Contraseña</label>
                <input
                    type='password'
                    id='newPassword'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='Escribe aquí tu contraseña'
                    minLength='8'
                    maxLength='25'
                    required
                />

                <label htmlFor='repeatedPassword'>Repetir contraseña</label>
                <input
                    type='password'
                    id='repeatedPassword'
                    value={repeatedPassword}
                    onChange={(e) => setRepeatedPassword(e.target.value)}
                    placeholder='Repite aquí tu contraseña'
                    minLength='8'
                    maxLength='25'
                    required
                />
                <div className='mx-auto'>
                    <button className='mr-4' type='submit'>
                        Cambiar
                    </button>
                    <button onClick={resetInputs}>Limpiar</button>
                </div>
            </fieldset>
        </form>
    );
};

export default ChangeRecoverPasswordPage;
