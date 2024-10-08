import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import { fetchDetailServiceServices } from '../services/serviceServices.js';
import ListEmployeeComponent from '../components/AdminDashboard/Services/ListEmployeeComponent.jsx';
import MapComponent from '../components/MapComponent.jsx';
import toast from 'react-hot-toast';

const DetailServicePage = () => {
    const { serviceId } = useParams();
    const { authToken } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [location, setLocation] = useState({});

    useEffect(() => {
        const DetailService = async () => {
            try {
                const data = await fetchDetailServiceServices(
                    serviceId,
                    authToken
                );

                setData(data);
                setLocation({
                    currentLocation: {
                        lat: data.latitudeIn,
                        lng: data.longitudeIn,
                    },
                });
            } catch (error) {
                toast.error(error.message, { id: 'error' });
            }
        };
        DetailService();
    }, [serviceId, authToken]);

    const startTime = new Date(data.startDateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    const endTime = new Date(data.endDateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const startDate = new Date(data.startDateTime).toLocaleDateString();

    const clockIn = new Date(data.clockIn).toLocaleString();
    const clockOut = new Date(data.clockOut).toLocaleString();

    return (
        <section>
            <form className='mx-auto'>
                <fieldset>
                    <legend>Solicitud</legend>
                    <p className='mt-2'>{data.type}</p>
                    <p>{data.comments}</p>
                    <p>
                        Solicitado el {startDate} de {startTime} a {endTime}
                    </p>
                    <p className='grow'>
                        En {data.address}, {data.city}, {data.postCode},{' '}
                        {data.province}
                    </p>
                    <p>Horas contratadas: {data.hours}</p>
                    <p>Personas contratadas: {data.numberOfPeople}</p>
                    <p className='font-extrabold'>Total: {data.totalPrice}€</p>
                </fieldset>
            </form>
            <form className='mx-auto'>
                <fieldset>
                    <legend>Cliente</legend>
                    <p className='mt-2'>
                        {data.firstName} {data.lastName}
                    </p>
                    <p>{data.email}</p>
                    <p>{data.dni}</p>
                    <p>{data.phone}</p>
                </fieldset>
            </form>
            {data.status === 'pending' && (
                <ListEmployeeComponent serviceId={serviceId} />
            )}
            {data.status === 'completed' && (
                <form className='mx-auto'>
                    <fieldset>
                        <legend>Empleado</legend>
                        <p className='mt-2'>
                            {data.firstNameEmployee} {data.lastNameEmployee}
                        </p>
                        <p className='font-extrabold'>Entrada: {clockIn}</p>
                        <p className='font-extrabold'>Salida: {clockOut}</p>
                        {(data.hoursWorked || data.minutesWorked !== null) && (
                            <p>
                                Total: {data.hoursWorked} Horas{' '}
                                {data.minutesWorked} Minutos
                            </p>
                        )}
                        <div className='flex mb-2 justify-center'>
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={data.id}
                                    size={30}
                                    color={
                                        index + 1 <= data.rating
                                            ? '#ffc107'
                                            : '#e4e5e9'
                                    }
                                />
                            ))}
                        </div>
                        {location.currentLocation ? (
                            <div>
                                <MapComponent location={location} />
                            </div>
                        ) : (
                            <span>Cargando el mapa</span>
                        )}
                    </fieldset>
                </form>
            )}
        </section>
    );
};

export default DetailServicePage;
