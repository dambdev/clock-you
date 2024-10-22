import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';

import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchEmployeeAllServicesServices } from '../../services/serviceServices.js';
import CalendarComponent from '../CalendarComponent.jsx';

const MyServicesComponent = () => {
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const handleHideClick = (e) => {
        e.preventDefault();
        setIsVisible(!isVisible);
    };

    const resetFilter = (e) => {
        e.preventDefault();
        setStatus('');
    };

    useEffect(() => {
        const searchParams = new URLSearchParams({
            status: status,
        });
        const searchParamsToString = searchParams.toString();
        const getServices = async () => {
            try {
                const data = await fetchEmployeeAllServicesServices(
                    searchParamsToString,
                    authToken
                );
                const dataFiltered = data.filter((data) => {
                    return (
                        data.status === 'confirmed' ||
                        data.status === 'completed' ||
                        data.status === 'accepted'
                    );
                });

                setData(dataFiltered);
            } catch (error) {
                toast.error(error.message, {
                    id: 'error',
                });
            }
        };
        getServices();
    }, [status, authToken]);

    const handleSelectEvent = (event) => {
        const selectedEventData = data.find(
            (d) => d.serviceId === event.serviceId
        );
        if (selectedEventData) {
            navigate(`/services/employee/${selectedEventData.serviceId}`, {
                state: selectedEventData,
            });
        }
    };

    const event = data.map((event) => ({
        title: event.type,
        start: new Date(event.startDateTime),
        end: new Date(event.endDateTime),
        allDay: false,
        serviceId: event.serviceId,
        status: event.status,
    }));

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
                    <option value='completed'>Completado</option>
                    <option value='confirmed'>Confirmado</option>
                </select>
                <button onClick={resetFilter}>Limpiar Filtros</button>
                <button onClick={handleHideClick}>
                    {isVisible ? 'Ocultar colores' : 'Mostrar colores'}
                </button>
            </form>
            <div>
                {isVisible && (
                    <div className='manager-tabs colors'>
                        <span style={{ backgroundColor: 'orange' }}>
                            Aceptado
                        </span>
                        <span style={{ backgroundColor: 'green' }}>
                            Completado
                        </span>
                        <span style={{ backgroundColor: 'lightgreen' }}>
                            Confirmado
                        </span>
                    </div>
                )}
            </div>
            <CalendarComponent
                events={event}
                onSelectEvent={handleSelectEvent}
                defaultView='day'
            />
        </>
    );
};

export default MyServicesComponent;
