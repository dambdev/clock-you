const { VITE_START_TIME, VITE_END_TIME } = import.meta.env;
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {
    fetchDetailServiceServices,
    fetchEditServiceServices,
    fetchDeleteServiceService,
} from '../services/serviceServices';
import toast from 'react-hot-toast';

const EditServicePage = () => {
    const { serviceId } = useParams();
    const { authToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const [hours, setHours] = useState(1);

    const timeIntervals = () => {
        const options = [];
        const startHour = VITE_START_TIME;
        const endHour = VITE_END_TIME - hours;
        for (let i = startHour * 60; i <= endHour * 60; i += 30) {
            const hours = Math.floor(i / 60);
            const minutes = i % 60;
            const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            options.push(time);
        }
        return options;
    };

    const valuesTimeInterval = timeIntervals();

    const [data, setData] = useState([]);
    const [startDateTime, setStartDateTime] = useState('');
    const [address, setAddress] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');
    const [comments, setComments] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState();
    const [totalPrice, setTotalPrice] = useState('');

    useEffect(() => {
        setTotalPrice(hours * numberOfPeople * data.price);
    }, [hours, numberOfPeople, data.price]);

    useEffect(() => {
        const getService = async () => {
            try {
                const data = await fetchDetailServiceServices(
                    serviceId,
                    authToken
                );
                setData(data);
                setHours(data.hours);
                setStartDateTime(data.startDateTime);
                setAddress(data.address);
                setPostCode(data.postCode);
                setCity(data.city);
                setComments(data.comments);
                setNumberOfPeople(data.numberOfPeople);
                setTotalPrice(data.totalPrice);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };

        getService();
    }, [serviceId, authToken]);

    const handleEditService = async (e) => {
        e.preventDefault();

        try {
            const startDate = new Date(startDateTime);

            const endDate = new Date(
                startDate.getTime() + hours * 60 * 60 * 1000
            );

            const formattedStartDateTime = startDate
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            const formattedEndDateTime = endDate
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            const data = await fetchEditServiceServices(
                serviceId,
                comments,
                address,
                hours,
                city,
                formattedStartDateTime,
                formattedEndDateTime,
                totalPrice,
                postCode,
                numberOfPeople,
                authToken
            );
            toast.success(data.message, {
                id: 'ok',
            });
            navigate('/user#OrdersComponent');
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    const handleDeleteService = async () => {
        if (
            window.confirm(
                '¿Estás seguro de querer eliminar este servicio?\n¡¡¡Esta acción no se puede deshacer!!!'
            )
        ) {
            try {
                const data = await fetchDeleteServiceService(
                    serviceId,
                    authToken
                );
                toast.success(data.message, {
                    id: 'ok',
                });
                navigate('/user#OrdersComponent');
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        }
    };

    return (
        <form className='profile-form mx-auto'>
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
                    maxLength='250'
                    rows='5'
                    required
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
