import toast from 'react-hot-toast';
import RatingModal from './RatingServiceComponent.jsx';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchClientAllServicesServices } from '../../services/serviceServices.js';
import { useEffect, useState, useContext } from 'react';
import { FaStar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const OrdersComponent = () => {
    const { session } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const getList = async () => {
        const searchParams = new URLSearchParams({
            status: status,
            type: type,
            city: city,
            startDate: startDate,
            endDate: endDate,
        });
        const searchParamsToString = searchParams.toString();
        try {
            const response = await fetchClientAllServicesServices(
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

    useEffect(() => {
        getList();
    }, [status, type, city, startDate, endDate]);

    const cityNoRepeated = [...new Set(data.map((item) => item.city))].sort(
        (a, b) => a.localeCompare(b)
    );
    const typeNoRepeated = [...new Set(data.map((item) => item.type))].sort(
        (a, b) => a.localeCompare(b)
    );

    const resetFilters = (e) => {
        e.preventDefault();
        setStatus('');
        setType('');
        setCity('');
        setStartDate('');
        setEndDate('');
    };

    const openModal = (serviceId) => {
        setSelectedServiceId(serviceId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedServiceId(null);
    };

    if (loading) return null;

    return (
        <>
            <form className='form-filters'>
                <input
                    id='startDate'
                    type='datetime-local'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    id='endDate'
                    type='datetime-local'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
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
                    {cityNoRepeated.map((city) => {
                        return (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        );
                    })}
                </select>
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
                    <option value='completed'>Completado</option>
                    <option value='confirmed'>Confirmado</option>
                    <option value='pending'>Pendiente</option>
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
            <ul className='cards'>
                {data.map((item) => {
                    const startTime = new Date(
                        item.startDateTime
                    ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    const endTime = new Date(
                        item.endDateTime
                    ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    const startDate = new Date(
                        item.startDateTime
                    ).toLocaleDateString();

                    return (
                        <li key={item.id} className='relative'>
                            <div className='icon-container'>
                                {item.status === 'completed' ? (
                                    <FaCheckCircle className='text-green-500' />
                                ) : (
                                    <FaExclamationCircle className='text-yellow-500' />
                                )}
                            </div>
                            <h3>{item.type}</h3>
                            <p>
                                El día {startDate} de {startTime} a {endTime}
                            </p>
                            <p className='grow'>{item.comments}</p>
                            <p className='grow'>
                                En {item.address}, {item.city}, {item.postCode},{' '}
                                {item.province}
                            </p>
                            <p>Precio hora: {item.price}€</p>
                            <p>Horas contratadas: {item.hours}</p>
                            <p>Personas contratadas: {item.numberOfPeople}</p>
                            <p>Total: {item.totalPrice}€</p>
                            {item.status === 'pending' && (
                                <NavLink to={`/user/services/edit/${item.id}`}>
                                    Editar
                                </NavLink>
                            )}
                            {item.status === 'accepted' && (
                                <NavLink
                                    to={`/services/validate/${item.validationCode}`}
                                >
                                    Confirmar
                                </NavLink>
                            )}
                            {item.status === 'confirmed' && (
                                <button
                                    onClick={() => {
                                        toast.error(
                                            'Cuando el servicio esté completado lo podrá valorar.',
                                            { id: 'error' }
                                        );
                                    }}
                                >
                                    Valorar
                                </button>
                            )}
                            {item.status === 'completed' &&
                            item.rating !== null ? (
                                <div className='flex mt-2 mb-4'>
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            size={30}
                                            color={
                                                index + 1 <= item.rating
                                                    ? '#ffc107'
                                                    : '#e4e5e9'
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                item.status === 'completed' && (
                                    <button onClick={() => openModal(item.id)}>
                                        Valorar
                                    </button>
                                )
                            )}
                        </li>
                    );
                })}
            </ul>
            <RatingModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                serviceId={selectedServiceId}
                onRatingSuccess={getList}
            />
        </>
    );
};

export default OrdersComponent;
