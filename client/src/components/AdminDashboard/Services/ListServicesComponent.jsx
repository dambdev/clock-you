import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAllTypeOfServicesServices } from '../../../services/typeOfServiceServices';

const ListServicesComponent = () => {
    const [data, setData] = useState([]);
    const [city, setCity] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTypeOfServices = async () => {
            const searchParams = new URLSearchParams({
                city: city,
                type: type,
                price: price,
            });
            const searchParamsToString = searchParams.toString();
            try {
                const response = await fetchAllTypeOfServicesServices(
                    searchParamsToString
                );
                if (!response) {
                    setData(null);
                } else {
                    setData(response);
                }
                setLoading(false);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        getTypeOfServices();
    }, [city, type, price]);

    const citiesNoRepeated = [
        ...new Set((data || []).map((item) => item.city)),
    ].sort((a, b) => a.localeCompare(b));
    const typeNoRepeated = [
        ...new Set((data || []).map((item) => item.type)),
    ].sort((a, b) => a.localeCompare(b));

    const resetFilters = (e) => {
        e.preventDefault();
        setCity('');
        setType('');
        setPrice('');
    };

    if (loading) return null;

    return (
        <>
            <form className='form-filters'>
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
                    name='precio'
                    id='precio'
                    value={price}
                    onChange={(e) => {
                        setPrice(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Precio:
                    </option>
                    <option value='ASC'>Ascendente</option>
                    <option value='DESC'>Descendente</option>
                </select>
                <select
                    name='typeOfService'
                    id='typeOfService'
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Tipo de Servicio:
                    </option>
                    {typeNoRepeated.map((type) => {
                        return (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        );
                    })}
                </select>
                <button onClick={resetFilters}>Limpiar Filtros</button>
            </form>
            {data ? (
                <ul className='cards'>
                    {data.map((item) => {
                        return (
                            <li id={item.id} key={item.id}>
                                <h3>{item.type}</h3>

                                <p className='grow'>{item.description}</p>

                                <p className='font-extrabold'>{item.city}</p>

                                <p>{item.price}€</p>

                                <NavLink
                                    className='mb-4'
                                    to={`/typeOfServices/edit/${item.id}`}
                                >
                                    Editar
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <h3 className='mt-4 text-center'>
                    No se encontraron servicios
                </h3>
            )}
        </>
    );
};

export default ListServicesComponent;
