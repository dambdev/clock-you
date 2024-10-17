import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';
import { fetchNewServiceServices } from '../services/serviceServices';

const { VITE_START_TIME, VITE_END_TIME } = import.meta.env;

import toast from 'react-hot-toast';

const NewServiceFormComponent = ({ typeOfServiceId, price }) => {
    const { authToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const delayedNavigation = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 750);
    };

    const noAuthenticated = () => {
        if (!authToken) {
            toast('Debes de iniciar sesión para poder enviar el formulario', {
                id: 'ok',
            });
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
        return {
            date: getTomorrowDate(),
            hours: 1,
            numberOfPeople: 1,
            time: timeIntervals(1)[0],
            totalPrice: 0,
            comments: '',
        };
    };

    const [serviceEntries, setServiceEntries] = useState([
        createNewServiceEntry(),
    ]);
    const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
    const [address, setAddress] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');

    const currentEntry = serviceEntries[currentEntryIndex];

    const totalAccumulatedPrice = serviceEntries.reduce(
        (acc, entry) => acc + entry.totalPrice,
        0
    );

    const resetInputs = (e) => {
        e.preventDefault();
        setServiceEntries([createNewServiceEntry()]);
        setCurrentEntryIndex(0);
        setAddress('');
        setPostCode('');
        setCity('');
    };

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

            delayedNavigation('/user#OrdersComponent');
        } catch (error) {
            toast.error(error.message, { id: 'error' });
        }
    };

    const handleServiceChange = (field, value) => {
        setServiceEntries((prevEntries) => {
            const newEntries = [...prevEntries];
            const serviceEntry = newEntries[currentEntryIndex];
            const newHours = field === 'hours' ? value : serviceEntry.hours;
            const newNumberOfPeople =
                field === 'numberOfPeople'
                    ? value
                    : serviceEntry.numberOfPeople;

            newEntries[currentEntryIndex] = {
                ...serviceEntry,
                [field]: value,
                totalPrice:
                    parseInt(newHours) *
                    parseInt(newNumberOfPeople) *
                    parseFloat(price),
            };
            return newEntries;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        serviceEntries.forEach((entry) => {
            handleNewService(entry);
        });
    };

    const handleAddServiceEntry = () => {
        setServiceEntries((prevEntries) => [
            ...prevEntries,
            createNewServiceEntry(),
        ]);
        setCurrentEntryIndex(serviceEntries.length);
    };

    const handleSwitchEntry = (index) => {
        setCurrentEntryIndex(index);
    };

    return (
        <form className='profile-form' onSubmit={handleSubmit}>
            <fieldset>
                <legend>Solicítalo</legend>
                <section className='flex flex-col gap-2'>
                    <label htmlFor='date'>Fecha</label>
                    <input
                        required
                        type='date'
                        id='date'
                        onClick={noAuthenticated}
                        value={currentEntry.date}
                        min={getTomorrowDate()}
                        onChange={(e) =>
                            handleServiceChange('date', e.target.value)
                        }
                    />
                    <label htmlFor='hours'>Horas a contratar</label>
                    <select
                        required
                        id='hours'
                        onFocus={noAuthenticated}
                        value={currentEntry.hours}
                        onChange={(e) =>
                            handleServiceChange(
                                'hours',
                                parseInt(e.target.value)
                            )
                        }
                    >
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>
                    <label htmlFor='numberOfPeople'>Personas a contratar</label>
                    <select
                        required
                        id='numberOfPeople'
                        onFocus={noAuthenticated}
                        value={currentEntry.numberOfPeople}
                        onChange={(e) =>
                            handleServiceChange(
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
                    <label htmlFor='time'>Hora de inicio</label>
                    <select
                        required
                        id='time'
                        onFocus={noAuthenticated}
                        value={currentEntry.time}
                        onChange={(e) =>
                            handleServiceChange('time', e.target.value)
                        }
                    >
                        {timeIntervals(currentEntry.hours).map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                    <label htmlFor='totalPrice'>Precio</label>
                    <input
                        type='text'
                        disabled
                        placeholder={`${currentEntry.totalPrice} €`}
                    />
                    <label htmlFor='comments'>Comentarios</label>
                    <textarea
                        required
                        id='comments'
                        minLength='10'
                        maxLength='250'
                        placeholder='Añada comentarios adicionales para describir con detalle sus necesidades sobre el servicio solicitado'
                        onFocus={noAuthenticated}
                        value={currentEntry.comments}
                        onChange={(e) =>
                            handleServiceChange('comments', e.target.value)
                        }
                    ></textarea>
                </section>
                <div className='mx-auto'>
                    <button type='button' onClick={handleAddServiceEntry}>
                        Añadir otro día
                    </button>
                    {serviceEntries.length > 1 && (
                        <>
                            <select
                                className='ml-4'
                                value={currentEntryIndex}
                                onChange={(e) =>
                                    handleSwitchEntry(parseInt(e.target.value))
                                }
                            >
                                {serviceEntries.map((_, idx) => (
                                    <option key={idx} value={idx}>
                                        Día {idx + 1}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
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
                <label htmlFor='totalPrice'>Total</label>
                <input
                    type='text'
                    disabled
                    placeholder={`${totalAccumulatedPrice} €`}
                />
                <div className='mx-auto'>
                    <button
                        className='mr-4'
                        type='submit'
                        disabled={!authToken}
                    >
                        Solicitar
                    </button>
                    <button onClick={resetInputs}>Limpiar</button>
                </div>
            </fieldset>
        </form>
    );
};

export default NewServiceFormComponent;
