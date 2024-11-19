import toast from 'react-hot-toast';
import useUser from '../hooks/useUser';
import { fetchLoginUserServices } from '../services/userServices';
import { Navigate, useNavigate, NavLink } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
    const navigate = useNavigate();

    const { user } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const resetInputs = (e) => {
        e.preventDefault();
        setEmail('');
        setPassword('');
    };

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        toast.promise(fetchLoginUserServices(email, password), {
            loading: 'Iniciando sesion...',
            success: (response) => {
                delayedNavigation('/');
                return response.message;
            },
            error: (error) => error.message,
        });
    };

    if (user) return <Navigate to='/' />;

    return (
        <form onSubmit={handleLogin}>
            <fieldset>
                <legend>Inicio</legend>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Escribe aquí tu email'
                    required
                />
                <label htmlFor='password'>Contraseña</label>
                <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Escribe aquí tu contraseña'
                    minLength='8'
                    required
                />
                <div className='mx-auto'>
                    <button className='mr-4' type='submit'>
                        Iniciar
                    </button>
                    <button onClick={resetInputs}>Limpiar</button>
                </div>
                <NavLink className='text-center' to='/recoverpassword'>
                    ¿Has olvidado tu contraseña?
                </NavLink>
            </fieldset>
        </form>
    );
};

export default LoginPage;
