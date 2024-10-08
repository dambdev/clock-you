import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';

import { fetchNewServiceServices } from '../services/serviceServices';

import toast from 'react-hot-toast';

const { VITE_START_TIME, VITE_END_TIME } = import.meta.env;

const NewServiceFormComponent = ({ typeOfServiceId, price }) => {
    const { authToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const noAuthenticated = () => {
        if (!authToken) {
            toast.error(
                'Debes iniciar sesión para poder enviar el formulario',
                { id: 'ok' }
            );
        }
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const timeIntervals = (hours) => {
        const options = [];
        const startHour = VITE_START_TIME;
        const endHour = VITE_END_TIME - hours;
        for (let i = startHour * 60; i <= endHour * 60; i += 30) {
            const currentHours = Math.floor(i / 60);
            const minutes = i % 60;
            const time = `${currentHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            options.push(time);
        }
        return options;
    };

    const createNewServiceEntry = () => {
        const initialHours = 1;
        const initialNumberOfPeople = 1;
        const initialPrice = 0;
        const initialComments = '';
        return {
            date: getTomorrowDate(),
            hours: initialHours,
            numberOfPeople: initialNumberOfPeople,
            time: timeIntervals(initialHours)[0],
            totalPrice: initialHours * initialNumberOfPeople * initialPrice,
            comments: initialComments,
        };
    };

    const [services, setServices] = useState([createNewServiceEntry()]);

    const [address, setAddress] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');

    const handleNewService = async (entry) => {
        try {
            const startDate = new Date(`${entry.date}T${entry.time}`);

            const endDate = new Date(
                startDate.getTime() + entry.hours * 60 * 60 * 1000
            );

            const formattedStartDateTime = startDate
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            const formattedEndDateTime = endDate
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            const data = await fetchNewServiceServices(
                authToken,
                typeOfServiceId,
                formattedStartDateTime,
                formattedEndDateTime,
                entry.numberOfPeople,
                entry.hours,
                address,
                postCode,
                city,
                entry.comments,
                entry.totalPrice
            );

            toast.success(data.message, { id: 'ok' });

            navigate('/user#OrdersComponent');
        } catch (error) {
            toast.error(error.message, { id: 'error' });
        }
    };

    const handleAddServiceEntry = () => {
        setServices([...services, createNewServiceEntry()]);
    };

    const handleServiceChange = (index, field, value) => {
        const updatedServices = services.map((service, i) => {
            if (i === index) {
                const newHours = field === 'hours' ? value : service.hours;
                const newNumberOfPeople =
                    field === 'numberOfPeople' ? value : service.numberOfPeople;

                return {
                    ...service,
                    [field]: value,
                    totalPrice:
                        parseInt(newHours) *
                        parseInt(newNumberOfPeople) *
                        parseFloat(price),
                };
            }
            return service;
        });
        setServices(updatedServices);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        services.forEach((entry) => {
            handleNewService(entry);
        });
    };

    return (
        <form className='profile-form' onSubmit={handleSubmit}>
            <fieldset>
                <legend>Solicítalo</legend>
                {services.map((entry, index) => (
                    <section
                        key={index}
                        className='flex flex-col gap-2 service-entry'
                    >
                        <label htmlFor={`date-${index}`}>Fecha</label>
                        <input
                            required
                            type='date'
                            id={`date-${index}`}
                            onClick={noAuthenticated}
                            value={entry.date}
                            min={getTomorrowDate()}
                            onChange={(e) =>
                                handleServiceChange(
                                    index,
                                    'date',
                                    e.target.value
                                )
                            }
                        />
                        <label htmlFor={`hours-${index}`}>
                            Horas a contratar
                        </label>
                        <select
                            required
                            id={`hours-${index}`}
                            onFocus={noAuthenticated}
                            value={entry.hours}
                            onChange={(e) =>
                                handleServiceChange(
                                    index,
                                    'hours',
                                    parseInt(e.target.value)
                                )
                            }
                        >
                            {Array.from({ length: 8 }, (_, i) => i + 1).map(
                                (i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                )
                            )}
                        </select>
                        <label htmlFor={`numberOfPeople-${index}`}>
                            Personas a contratar
                        </label>
                        <select
                            required
                            id={`numberOfPeople-${index}`}
                            onFocus={noAuthenticated}
                            value={entry.numberOfPeople}
                            onChange={(e) =>
                                handleServiceChange(
                                    index,
                                    'numberOfPeople',
                                    parseInt(e.target.value)
                                )
                            }
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                )
                            )}
                        </select>
                        <label htmlFor={`time-${index}`}>Hora de inicio</label>
                        <select
                            required
                            id={`time-${index}`}
                            onFocus={noAuthenticated}
                            value={entry.time}
                            onChange={(e) =>
                                handleServiceChange(
                                    index,
                                    'time',
                                    e.target.value
                                )
                            }
                        >
                            {timeIntervals(entry.hours).map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        <label htmlFor={`totalPrice-${index}`}>
                            Precio total
                        </label>
                        <input
                            type='text'
                            disabled
                            placeholder={`${entry.totalPrice} €`}
                        />
                        <label htmlFor={`comments-${index}`}>Comentarios</label>
                        <textarea
                            required
                            id='comments'
                            minLength='10'
                            maxLength='250'
                            placeholder='Añada comentarios adicionales para describir con detalle sus necesidades sobre el servicio solicitado'
                            onFocus={noAuthenticated}
                            value={entry.comments}
                            onChange={(e) =>
                                handleServiceChange(
                                    index,
                                    'comments',
                                    e.target.value
                                )
                            }
                        ></textarea>
                    </section>
                ))}
                <div className='mx-auto'>
                    <button type='button' onClick={handleAddServiceEntry}>
                        Añadir otro día
                    </button>
                </div>

                <label htmlFor='address'>Dirección</label>
                <input
                    required
                    type='text'
                    id='address'
                    value={address}
                    placeholder='Escribe aquí tu dirección'
                    onFocus={noAuthenticated}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <label htmlFor='postCode'>Código Postal</label>
                <input
                    required
                    type='number'
                    id='postCode'
                    placeholder='Escribe aquí tu código postal'
                    value={postCode}
                    onFocus={noAuthenticated}
                    onChange={(e) => setPostCode(e.target.value)}
                />
                <label htmlFor='city'>Localidad</label>
                <input
                    required
                    type='text'
                    id='city'
                    placeholder='Escribe aquí tu localidad'
                    value={city}
                    onFocus={noAuthenticated}
                    onChange={(e) => setCity(e.target.value)}
                />
                <div className='mx-auto'>
                    <button type='submit' disabled={!authToken}>
                        Solicitar
                    </button>
                </div>
            </fieldset>
        </form>
    );
};

export default NewServiceFormComponent;
