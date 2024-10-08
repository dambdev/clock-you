const { VITE_START_TIME, VITE_END_TIME } = import.meta.env;
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { fetchNewServiceServices } from '../services/serviceServices';
import toast from 'react-hot-toast';

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

    const [hours, setHours] = useState(1);

    const timeIntervals = () => {
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

    const valuesTimeInterval = timeIntervals();

    const [startDateTime, setStartDateTime] = useState(() => {
        const tomorrow = getTomorrowDate();
        return `${tomorrow}T${valuesTimeInterval[0]}`;
    });

    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [address, setAddress] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');
    const [comments, setComments] = useState('');
    const [totalPrice, setTotalPrice] = useState(price);

    useEffect(() => {
        setTotalPrice(hours * numberOfPeople * price);
    }, [hours, numberOfPeople, price]);

    const resetInputs = (e) => {
        e.preventDefault();
        setHours(1);
        setNumberOfPeople(1);
        setAddress('');
        setCity('');
        setComments('');
        setStartDateTime(() => {
            const tomorrow = getTomorrowDate();
            return `${tomorrow}T${valuesTimeInterval[0]}`;
        });
    };

    const handleNewService = async (e) => {
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

            const data = await fetchNewServiceServices(
                authToken,
                typeOfServiceId,
                formattedStartDateTime,
                formattedEndDateTime,
                numberOfPeople,
                hours,
                address,
                postCode,
                city,
                comments,
                totalPrice
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

    return (
        <form className='profile-form' onSubmit={handleNewService}>
            <fieldset>
                <legend>Solicítalo</legend>
                <label htmlFor='date'>Fecha</label>
                <input
                    required
                    type='date'
                    id='date'
                    value={startDateTime.split('T')[0]}
                    min={getTomorrowDate()}
                    onClick={noAuthenticated}
                    onChange={(e) =>
                        setStartDateTime(
                            e.target.value + 'T' + startDateTime.split('T')[1]
                        )
                    }
                />
                <label htmlFor='hours'>Horas a contratar</label>
                <select
                    required
                    id='hours'
                    value={hours}
                    onFocus={noAuthenticated}
                    onChange={(e) => {
                        setHours(e.target.value);
                    }}
                >
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                    <option value='8'>8</option>
                </select>
                <label htmlFor='hours'>Personas a contratar</label>
                <select
                    required
                    id='numberOfPeople'
                    value={numberOfPeople}
                    onFocus={noAuthenticated}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                >
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
                    onFocus={noAuthenticated}
                    onChange={(e) => {
                        setStartDateTime(
                            startDateTime.split('T')[0] + 'T' + e.target.value
                        );
                    }}
                >
                    <option value='' disabled>
                        Selecciona:
                    </option>
                    {valuesTimeInterval.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>

                <label htmlFor='totalPrice'>Precio total</label>
                <input type='text' disabled placeholder={`${totalPrice} €`} />
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
                    minLength='5'
                    maxLength='5'
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
                <label htmlFor='comments'>Comentarios</label>
                <textarea
                    required
                    id='comments'
                    placeholder='Añada comentarios adicionales para describir con detalle sus necesidades sobre el servicio solicitado'
                    minLength='10'
                    maxLength='250'
                    rows='5'
                    value={comments}
                    onFocus={noAuthenticated}
                    onChange={(e) => setComments(e.target.value)}
                ></textarea>
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
