import { AuthContext } from '../../../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { fetchRegisterAdminUserServices } from '../../../services/userServices';
import { fetchAllTypeOfServicesServices } from '../../../services/typeOfServiceServices';

import toast from 'react-hot-toast';

const RegisterAdminUserComponent = () => {
    const { authToken } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dni, setDni] = useState('');
    const [phone, setPhone] = useState('');
    const [job, setJob] = useState();
    const [city, setCity] = useState();
    const [role, setRole] = useState('admin');

    const resetInputs = (e) => {
        e.preventDefault();
        setEmail('');
        setFirstName('');
        setLastName('');
        setDni('');
        setPhone('');
        setJob();
        setCity();
        setRole('admin');
    };

    useEffect(() => {
        const getTypesOfServices = async () => {
            try {
                const data = await fetchAllTypeOfServicesServices();
                setData(data);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        getTypesOfServices();
    }, []);

    const typeNoRepeated = [
        ...new Set((data || []).map((item) => item.type)),
    ].sort((a, b) => a.localeCompare(b));
    const citiesNoRepeated = [
        ...new Set((data || []).map((item) => item.city)),
    ].sort((a, b) => a.localeCompare(b));

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = await fetchRegisterAdminUserServices(
                email,
                firstName,
                lastName,
                dni,
                phone,
                job,
                city,
                role,
                authToken
            );

            toast.success(data, {
                id: 'ok',
            });
            resetInputs(e);
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };
    return (
        <form onSubmit={handleRegister}>
            <fieldset>
                <legend>Usuario</legend>
                <label htmlFor='role'>Tipo de usuario:</label>
                <select
                    id='role'
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        setJob();
                        setCity();
                    }}
                    required
                >
                    <option value='admin'>Administrador</option>
                    <option value='employee'>Empleado</option>
                </select>
                {role !== 'admin' && (
                    <>
                        <label htmlFor='job'>Seleccione el trabajo:</label>
                        <select
                            name='job'
                            id='job'
                            value={job}
                            onChange={(e) => {
                                setJob(e.target.value);
                            }}
                        >
                            {typeNoRepeated.map((type) => {
                                return (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                );
                            })}
                        </select>
                        <label htmlFor='city'>Seleccione la ciudad:</label>
                        <select
                            name='city'
                            id='city'
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                            }}
                        >
                            {citiesNoRepeated.map((city) => {
                                return (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                );
                            })}
                        </select>
                    </>
                )}
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Escribe aquí el email'
                    required
                />
                <label htmlFor='firstName'>Nombre</label>
                <input
                    type='text'
                    id='firstName'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='Escribe aquí su nombre'
                    required
                />
                <label htmlFor='lastName'>Apellidos</label>
                <input
                    type='text'
                    id='lastName'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='Escribe aquí sus apellidos'
                    required
                />
                <label htmlFor='dni'>DNI/NIE</label>
                <input
                    type='text'
                    id='dni'
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder='Escribe aquí su DNI/NIE'
                    pattern='^[0-9]{8}[A-Za-z]$|^[XYZ][0-9]{7}[A-Za-z]$'
                    required
                />
                <label htmlFor='phone'>Teléfono</label>
                <input
                    type='tel'
                    id='phone'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='Escribe aquí su teléfono'
                    pattern='^\d{9}$'
                    required
                />

                <div className='mx-auto'>
                    <button className='mr-4' type='submit'>
                        Registrarse
                    </button>
                    <button onClick={resetInputs}>Limpiar</button>
                </div>
            </fieldset>
        </form>
    );
};

export default RegisterAdminUserComponent;
