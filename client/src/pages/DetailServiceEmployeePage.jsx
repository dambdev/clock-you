import MapComponent from '../components/MapComponent.jsx';
import ShiftRecordComponent from '../components/EmployeeDashBoard/ShiftRecordComponent.jsx';
import { FaStar } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useLocation } from 'react-router-dom';

const DetailServiceEmployeePage = () => {
    const location = useLocation();
    const { state: eventData } = location;
    const { authToken } = useContext(AuthContext);

    const data = eventData;

    const locationData = {
        startLocation: {
            lat: data.latitudeIn,
            lng: data.longitudeIn,
        },
        exitLocation: {
            lat: data.latitudeOut,
            lng: data.longitudeOut,
        },
    };

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
            <form>
                <fieldset>
                    <legend>Cliente</legend>
                    <p className='mt-2'>
                        {data.firstName} {data.lastName}
                    </p>
                    <p>{data.phone}</p>
                </fieldset>
            </form>
            <form>
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
                    <p className='font-extrabold'>Total: {data.totalPrice}€</p>
                </fieldset>
            </form>
            {(data.status === 'confirmed' ||
                (data.status === 'completed' && data.clockOut === null)) && (
                <ShiftRecordComponent
                    shiftRecordId={data.shiftRecordId}
                    clockIn={data.clockIn}
                    authToken={authToken}
                />
            )}
            {data.clockIn && data.clockOut !== null && (
                <form>
                    <fieldset>
                        <legend>Turno</legend>
                        <p className='mt-2'>Entrada: {clockIn}</p>
                        <p>Salida: {clockOut}</p>
                        <p>
                            Total: {data.hoursWorked} Horas {data.minutesWorked}{' '}
                            Minutos
                        </p>
                        <div className='flex mb-2 justify-center'>
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    size={30}
                                    color={
                                        index + 1 <= data.rating
                                            ? '#ffc107'
                                            : '#e4e5e9'
                                    }
                                />
                            ))}
                        </div>
                        {locationData.startLocation &&
                        locationData.exitLocation ? (
                            <div>
                                <MapComponent location={locationData} />
                            </div>
                        ) : (
                            <p>Cargando mapa...</p>
                        )}
                    </fieldset>
                </form>
            )}
        </section>
    );
};

export default DetailServiceEmployeePage;
