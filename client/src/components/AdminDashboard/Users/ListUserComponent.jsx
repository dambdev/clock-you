const { VITE_API_URL } = import.meta.env;
import { useEffect, useState } from 'react';
import { fetchAllUsersServices } from '../../../services/userServices';
import toast from 'react-hot-toast';

const ListUserComponent = () => {
    const [data, setData] = useState([]);
    const [city, setCity] = useState('');
    const [job, setJob] = useState('');
    const [role, setRole] = useState('');
    const [active, setActive] = useState('');
    const [loading, setLoading] = useState(true);
    const resetFilters = (e) => {
        e.preventDefault();
        setCity('');
        setJob('');
        setRole('');
        setActive('');
    };

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
                const response = await fetchAllUsersServices(
                    searchParamsToString
                );

                setData(response);
                setLoading(false);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        getAllUserList();
    }, [city, job, active, role]);

    const citiesNoRepeated = [
        ...new Set(
            data.map((item) => item.city?.trim()).filter((city) => city)
        ),
    ].sort((a, b) => a.localeCompare(b));

    const jobNoRepeated = [
        ...new Set(data.map((item) => item.job?.trim()).filter((job) => job)),
    ].sort((a, b) => a.localeCompare(b));

    if (loading) return null;

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
                    name='role'
                    id='role'
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Tipo:
                    </option>
                    <option value='admin'>Administrador</option>
                    <option value='client'>Cliente</option>
                    <option value='employee'>Empleado</option>
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
                            <p className='mb-4'>🏠 {item.city}</p>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default ListUserComponent;
