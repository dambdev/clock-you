const { VITE_CLIENT_URL } = import.meta.env;
import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { fecthAllServicesServices } from '../../../services/serviceServices.js';
import toast from 'react-hot-toast';

const ListContracts = () => {
    const { authToken } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [dateTime, setDateTime] = useState('');

    const resetFilter = (e) => {
        e.preventDefault();
        setStatus('');
        setDateTime('');
    };

    useEffect(() => {
        const getServices = async () => {
            const searchParams = new URLSearchParams({
                status: status,
                order: dateTime,
            });
            const searchParamsToString = searchParams.toString();
            try {
                const data = await fecthAllServicesServices(
                    searchParamsToString,
                    authToken
                );

                setData(data.data);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };
        getServices();
    }, [status, dateTime, authToken]);

    return (
        <>
            <form className='mx-auto form-filters'>
                <select
                    name='status'
                    id='status'
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Estado:
                    </option>
                    <option value='accepted'>Aceptado</option>
                    <option value='canceled'>Cancelado</option>
                    <option value='completed'>Completado</option>
                    <option value='confirmed'>Confirmado</option>
                    <option value='pending'>Pendiente</option>
                    <option value='rejected'>Rechazado</option>
                </select>
                <select
                    name='precio'
                    id='precio'
                    value={dateTime}
                    onChange={(e) => {
                        setDateTime(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Fecha:
                    </option>
                    <option value='ASC'>Ascendente</option>
                    <option value='DESC'>Descendente</option>
                </select>
                <button onClick={resetFilter}>Limpiar Filtros</button>
            </form>
            <ul className='cards'>
                {data.map((item) => {
                    const time = new Date(item.dateTime).toLocaleTimeString();
                    const date = new Date(item.dateTime).toLocaleDateString();
                    return (
                        <li key={item.id}>
                            <h3>
                                {item.type} en {item.province}
                            </h3>
                            <p>{item.status}</p>
                            <p>{item.city}</p>
                            <p>
                                {date} {time}
                            </p>

                            <NavLink
                                className='mb-4'
                                to={`/services/${item.serviceId}`}
                            >
                                Ver
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default ListContracts;