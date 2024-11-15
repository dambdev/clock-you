import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { VITE_API_URL } from '../../../../env.local.js';
import { fetchAllUsersServices } from '../../../services/userServices.js';
import { fetchNewShiftRecordServices } from '../../../services/shiftRecordServices.js';
import { useState, useEffect, useContext } from 'react';

const ListEmployeeComponent = ({ serviceId, onEmployeeAssigned }) => {
    const role = 'employee';

    const { authToken } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [active, setActive] = useState('');
    const [job, setJob] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        const getAllUserList = async () => {
            const searchParams = new URLSearchParams({
                city: city,
                job: job,
                role: role,
                active: active,
            });
            const searchParamsToString = searchParams.toString();
            try {
                const data = await fetchAllUsersServices(
                    searchParamsToString,
                    authToken
                );

                setData(data);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        getAllUserList();
    }, [city, job, active, authToken]);

    const citiesNoRepeated = [...new Set(data.map((item) => item.city))].sort(
        (a, b) => a.localeCompare(b)
    );
    const jobNoRepeated = [...new Set(data.map((item) => item.job))].sort(
        (a, b) => a.localeCompare(b)
    );

    const resetFilters = (e) => {
        e.preventDefault();
        setActive('');
        setCity('');
        setJob('');
    };

    const handleNewShiftRecord = async (employeeId, serviceId, authToken) => {
        try {
            const data = await fetchNewShiftRecordServices(
                employeeId,
                serviceId,
                authToken
            );

            toast.success(data.message, {
                id: 'ok',
            });

            onEmployeeAssigned();
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    return (
        <>
            <form className='form-filters'>
                <select
                    name='active'
                    id='active'
                    value={active}
                    onChange={(e) => {
                        setActive(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Activo:
                    </option>
                    <option value='1'>Activo</option>
                    <option value='0'>Desactivado</option>
                </select>
                <select
                    name='city'
                    id='city'
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Ciudad:
                    </option>
                    {citiesNoRepeated.map((city) => {
                        return (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        );
                    })}
                </select>
                <select
                    name='job'
                    id='job'
                    value={job}
                    onChange={(e) => {
                        setJob(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Trabajo:
                    </option>
                    {jobNoRepeated.map((job) => {
                        return (
                            <option key={job} value={job}>
                                {job}
                            </option>
                        );
                    })}
                </select>
                <button onClick={resetFilters}>Limpiar Filtros</button>
            </form>
            <ul className='cards'>
                {data.map((item) => {
                    const employeeId = item.id;
                    return (
                        <li key={item.id}>
                            <img
                                src={`${
                                    item.avatar
                                        ? `${VITE_API_URL}/${item.avatar}`
                                        : '/default-avatar.png'
                                }`}
                                alt='Avatar'
                            />
                            <h3>
                                👤 {item.firstName} {item.lastName}
                            </h3>
                            <p>✉️ {item.email}</p>
                            <p>📞 {item.phone}</p>
                            <p>🪪 {item.dni}</p>
                            <p>👨‍💻 {item.job}</p>
                            <p>🏠 {item.city}</p>

                            <button
                                onClick={() => {
                                    handleNewShiftRecord(
                                        employeeId,
                                        serviceId,
                                        authToken
                                    );
                                }}
                            >
                                Asignar Empleado
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default ListEmployeeComponent;

ListEmployeeComponent.propTypes = {
    serviceId: PropTypes.string.isRequired,
    onEmployeeAssigned: PropTypes.func.isRequired,
};
