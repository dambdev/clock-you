import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { VITE_START_TIME, VITE_END_TIME } from '../../env.local.js';
import { useContext, useEffect, useState } from 'react';
import {
    fetchDetailServiceServices,
    fetchEditServiceServices,
    fetchDeleteServiceService,
} from '../services/serviceServices';

const EditServicePage = () => {
    const navigate = useNavigate();

    const { serviceId } = useParams();
    const { authToken } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [startDateTime, setStartDateTime] = useState('');
    const [address, setAddress] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');
    const [comments, setComments] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState();
    const [totalPrice, setTotalPrice] = useState('');
    const [hours, setHours] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getService = async () => {
            try {
                const response = await fetchDetailServiceServices(serviceId);
                setData(response);
                setHours(response.hours);
                setStartDateTime(response.startDateTime);
                setAddress(response.address);
                setPostCode(response.postCode);
                setCity(response.city);
                setComments(response.comments);
                setNumberOfPeople(response.numberOfPeople);
                setTotalPrice(response.totalPrice);
                setLoading(false);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        getService();
    }, [serviceId, authToken]);

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const timeIntervals = () => {
        const options = [];
        const startHour = VITE_START_TIME;
        const endHour = VITE_END_TIME - hours;
        for (let i = startHour * 60; i <= endHour * 60; i += 30) {
            const hours = Math.floor(i / 60);
            const minutes = i % 60;
            const time = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}`;
            options.push(time);
        }
        return options;
    };

    const valuesTimeInterval = timeIntervals();

    useEffect(() => {
        setTotalPrice(hours * numberOfPeople * data.price);
    }, [hours, numberOfPeople, data.price]);

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    const handleEditService = async (e) => {
        e.preventDefault();

        const startDate = new Date(startDateTime);

        const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);

        const formattedStartDateTime = startDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        const formattedEndDateTime = endDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        toast.promise(
            fetchEditServiceServices(
                serviceId,
                comments,
                address,
                hours,
                city,
                formattedStartDateTime,
                formattedEndDateTime,
                totalPrice,
                postCode,
                numberOfPeople
            ),
            {
                loading: 'Editando servicio...',
                success: (response) => {
                    delayedNavigation('/user#orders');
                    return <b>{response}</b>;
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            }
        );
    };

    const handleDeleteService = async () => {
        if (
            window.confirm(
                '¿Estás seguro de querer eliminar este servicio?\n¡¡¡Esta acción no se puede deshacer!!!'
            )
        ) {
            toast.promise(fetchDeleteServiceService(serviceId), {
                loading: 'Eliminando servicio...',
                success: (response) => {
                    delayedNavigation('/user#orders');
                    return <b>{response}</b>;
                },
                error: (error) => {
                    return <b>{error.message}</b>;
                },
            });
        }
    };

    if (loading) return null;

    return (
        <form>
            <fieldset>
                <legend>
                    {data.type} en {data.province}
                </legend>
                <label htmlFor='date'>Fecha</label>
                <input
                    required
                    type='date'
                    id='date'
                    value={startDateTime.split('T')[0]}
                    min={getTomorrowDate()}
                    onChange={(e) =>
                        setStartDateTime(
                            e.target.value + 'T' + startDateTime.split('T')[1]
                        )
                    }
                />
                <label htmlFor='hours'>Horas contratadas</label>
                <select
                    id='hours'
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    required
                >
                    <option value='' disabled>
                        Selecciona la cantidad:
                    </option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                    <option value='8'>8</option>
                </select>
                <label htmlFor='hours'>Personas contratadas</label>
                <select
                    required
                    id='numberOfPeople'
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                >
                    <option value='' disabled>
                        Selecciona la cantidad:
                    </option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                    <option value='8'>8</option>
                    <option value='9'>9</option>
                    <option value='10'>10</option>
                </select>
                <label htmlFor='time'>Hora de inicio</label>
                <select
                    required
                    id='time'
                    value={startDateTime.split('T')[1]}
                    onChange={(e) => {
                        setStartDateTime(
                            startDateTime.split('T')[0] + 'T' + e.target.value
                        );
                    }}
                >
                    {valuesTimeInterval.map((opcion) => (
                        <option key={opcion} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
                <label htmlFor='totalPrice'>Precio total</label>
                <input type='text' disabled placeholder={`${totalPrice} €`} />
                <label htmlFor='address'>Dirección</label>
                <input
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <label htmlFor='postCode'>Código Postal</label>
                <input
                    type='number'
                    minLength='5'
                    maxLength='5'
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    required
                />
                <label htmlFor='city'>Ciudad</label>
                <input
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <label htmlFor='comments'>Comentarios</label>
                <textarea
                    value={comments}
                    minLength='10'
                    maxLength='500'
                    required
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onChange={(e) => setComments(e.target.value)}
                />
                <div className='mx-auto'>
                    <button
                        className='mr-4'
                        type='submit'
                        onClick={handleEditService}
                    >
                        Guardar Cambios
                    </button>
                    <button
                        className='ml-4 bg-red-500 text-white'
                        type='button'
                        onClick={handleDeleteService}
                    >
                        Eliminar Servicio
                    </button>
                </div>
            </fieldset>
        </form>
    );
};

export default EditServicePage;
