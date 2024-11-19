import toast from 'react-hot-toast';
import useUser from '../hooks/useUser';
import MapComponent from '../components/MapComponent.jsx';
import ListEmployeeComponent from '../components/AdminDashboard/Services/ListEmployeeComponent.jsx';
import { AuthContext } from '../context/AuthContext';
import { FaStar, FaTrash } from 'react-icons/fa';
import { useParams, Navigate } from 'react-router-dom';
import { fetchDetailServiceServices } from '../services/serviceServices.js';
import { fetchDeleteShiftRecordServices } from '../services/shiftRecordServices';
import { useState, useEffect, useContext } from 'react';

const DetailServicePage = () => {
    const { serviceId } = useParams();
    const { session } = useContext(AuthContext);
    const { user } = useUser();

    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const detailService = async () => {
            try {
                const response = await fetchDetailServiceServices(serviceId);
                setData(response);
                setLoading(false);
            } catch (error) {
                toast.error(error.message, { id: 'error' });
            }
        };
        detailService();
    }, [serviceId, refresh]);

    if (!session && !user) return <Navigate to='/' />;

    const deleteShiftRecord = async (e, shiftRecordId) => {
        e.preventDefault();
        toast.promise(fetchDeleteShiftRecordServices(shiftRecordId), {
            loading: 'Eliminando turno...',
            success: (response) => {
                setRefresh((prev) => !prev);
                return response;
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    const formatDate = (date) => new Date(date).toLocaleString();

    const startTime = new Date(data.startDateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    const endTime = new Date(data.endDateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const startDate = new Date(data.startDateTime).toLocaleDateString();

    if (loading) return null;

    return (
        <section>
            <form>
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
                    <p>Personas contratadas: {data.numberOfPeople}</p>
                    <p className='font-extrabold'>Total: {data.totalPrice}€</p>
                </fieldset>
            </form>
            {data.status !== 'completed' && data.status !== 'canceled' ? (
                <>
                    <form>
                        <fieldset>
                            <legend>Empleados asignados</legend>
                            {Array.isArray(data.employees) &&
                                data.employees.map((employee, index) => (
                                    <p
                                        key={
                                            index + '-' + employee.shiftRecordId
                                        }
                                        className='mt-2'
                                    >
                                        {employee.firstNameEmployee}{' '}
                                        {employee.lastNameEmployee}
                                        <button
                                            className='ml-4'
                                            onClick={(e) =>
                                                deleteShiftRecord(
                                                    e,
                                                    employee.shiftRecordId
                                                )
                                            }
                                        >
                                            <FaTrash />
                                        </button>
                                    </p>
                                ))}
                        </fieldset>
                    </form>
                    <ListEmployeeComponent
                        serviceId={serviceId}
                        onEmployeeAssigned={() => setRefresh((prev) => !prev)}
                    />
                </>
            ) : (
                <form>
                    <fieldset>
                        <legend>Empleado/s</legend>
                        {Array.isArray(data.employees) &&
                            data.employees.map((employee) => (
                                <>
                                    <div key={employee.shiftRecordId}>
                                        <p>
                                            {employee.firstNameEmployee}{' '}
                                            {employee.lastNameEmployee}
                                        </p>
                                        <p className='my-2'>
                                            Entrada:{' '}
                                            {formatDate(employee.clockIn)}
                                        </p>
                                        <p>
                                            Salida:{' '}
                                            {formatDate(employee.clockOut)}
                                        </p>
                                        <p className='font-extrabold mt-2'>
                                            Total: {employee.hoursWorked} Horas{' '}
                                            {employee.minutesWorked} Minutos
                                        </p>
                                    </div>
                                    <section className='flex mb-2 justify-center'>
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                key={index + '-'}
                                                size={30}
                                                color={
                                                    index + 1 <= data.rating
                                                        ? '#ffc107'
                                                        : '#e4e5e9'
                                                }
                                            />
                                        ))}
                                    </section>
                                    <MapComponent
                                        location={{
                                            startLocation: {
                                                lat: employee.latitudeIn,
                                                lng: employee.longitudeIn,
                                            },
                                            exitLocation: {
                                                lat: employee.latitudeOut,
                                                lng: employee.longitudeOut,
                                            },
                                        }}
                                    />
                                </>
                            ))}
                    </fieldset>
                </form>
            )}
        </section>
    );
};

export default DetailServicePage;
