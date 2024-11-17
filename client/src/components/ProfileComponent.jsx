import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import {
    fetchEditUserServices,
    fetchEditPasswordUserServices,
    fetchDeleteUserServices,
} from '../services/userServices';

const ProfileComponent = ({ user }) => {
    const navigate = useNavigate();

    const { authToken, authLogout } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            setFirstName(user?.firstName);
            setLastName(user?.lastName);
            setPhone(user?.phone);
        }
    }, [user]);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [actualPassword, setActualPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatedNewPassword, setRepeatedNewPassword] = useState('');

    const handleEditUser = async (e) => {
        e.preventDefault();
        toast.promise(
            fetchEditUserServices(firstName, lastName, phone, user?.id),
            {
                loading: 'Editando datos...',
                success: (response) => {
                    toast.success(response, {
                        id: 'ok',
                    });
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            }
        );
    };

    const handleEditPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== repeatedNewPassword) {
            throw new Error('¡Las nuevas contraseñas no coinciden!');
        } else {
            toast.promise(
                fetchEditPasswordUserServices(
                    actualPassword,
                    newPassword,
                    user?.id
                ),
                {
                    loading: 'Editando contraseña...',
                    success: (response) => {
                        setActualPassword('');
                        setNewPassword('');
                        setRepeatedNewPassword('');
                        return <b>{response}</b>;
                    },
                    error: (error) => {
                        return <b>{error.message}</b>;
                    },
                }
            );
        }
    };

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        if (
            window.confirm(
                '¿Estás seguro de querer eliminar tu cuenta?\n¡¡¡Esta acción no se puede deshacer!!!'
            )
        ) {
            toast.promise(fetchDeleteUserServices(user?.id), {
                loading: 'Eliminando usuario...',
                success: (response) => {
                    authLogout();
                    delayedNavigation('/');
                    return <b>{response}</b>;
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            });
        }
    };

    if (!user) return null;

    return (
        <section className='flex-1024'>
            <form className='form-1024' onSubmit={handleEditUser}>
                <fieldset>
                    <legend>Datos</legend>
                    <label htmlFor='email'>Email</label>
                    <input disabled value={user?.email || ''} />

                    <label htmlFor='firstName'>Nombre</label>
                    <input
                        type='text'
                        id='firstName'
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                        required
                    />
                    <label htmlFor='lastName'>Apellidos</label>
                    <input
                        type='text'
                        id='lastName'
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                        required
                    />
                    <label htmlFor='dni'>DNI</label>
                    <input disabled value={user?.dni || ''} />
                    <label htmlFor='phone'>Teléfono</label>
                    <input
                        type='tel'
                        id='phone'
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                        }}
                        required
                    />
                    {user?.role === 'employee' && (
                        <>
                            <label htmlFor='job'>Trabajo</label>
                            <input disabled value={user?.job || ''} />
                            <label htmlFor='city'>Ciudad</label>
                            <input disabled value={user?.city || ''} />
                        </>
                    )}
                    <div className='mx-auto'>
                        <button type='submit'>Guardar Cambios</button>
                    </div>
                </fieldset>
            </form>
            <section className='form-1024'>
                <form onSubmit={handleEditPassword}>
                    <fieldset>
                        <legend>Contraseña</legend>
                        <label htmlFor='actualPassword'>
                            Contraseña Actual
                        </label>
                        <input
                            type='password'
                            id='actualPassword'
                            value={actualPassword}
                            placeholder='Escribe aquí tu contraseña actual'
                            minLength='8'
                            maxLength='25'
                            required
                            onChange={(e) => {
                                setActualPassword(e.target.value);
                            }}
                        />
                        <label htmlFor='newPassword'>Nueva Contraseña</label>
                        <input
                            type='password'
                            id='newPassword'
                            value={newPassword}
                            placeholder='Escribe aquí tu nueva contraseña'
                            minLength='8'
                            maxLength='25'
                            required
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                            }}
                        />
                        <label htmlFor='repeatNewPassword'>
                            Repetir Contraseña
                        </label>
                        <input
                            type='password'
                            id='repeatNewPassword'
                            placeholder='Repite aquí tu nueva contraseña'
                            minLength='8'
                            maxLength='25'
                            required
                            value={repeatedNewPassword}
                            onChange={(e) => {
                                setRepeatedNewPassword(e.target.value);
                            }}
                        />
                        <div className='mx-auto'>
                            <button type='submit'>Cambiar Contraseña</button>
                        </div>
                    </fieldset>
                </form>
                <form onSubmit={handleDeleteUser}>
                    <fieldset>
                        <div className='mx-auto'>
                            <button
                                className='bg-red-500 text-white mt-2'
                                type='submit'
                            >
                                Eliminar Usuario
                            </button>
                        </div>
                    </fieldset>
                </form>
            </section>
        </section>
    );
};

export default ProfileComponent;

ProfileComponent.propTypes = {
    user: PropTypes.object,
};
