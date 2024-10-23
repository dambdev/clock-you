import { FaStar, FaTrash } from 'react-icons/fa';
import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

import { AuthContext } from '../context/AuthContext';
import { fetchDetailServiceServices } from '../services/serviceServices.js';
import { fetchDeleteShiftRecordServices } from '../services/shiftRecordServices';
import useUser from '../hooks/useUser';
import MapComponent from '../components/MapComponent.jsx';
import ListEmployeeComponent from '../components/AdminDashboard/Services/ListEmployeeComponent.jsx';

const DetailServicePage = () => {
    const { serviceId } = useParams();
    const { authToken } = useContext(AuthContext);
    const { user } = useUser();

    const [data, setData] = useState({});
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const detailService = async () => {
            try {
                const data = await fetchDetailServiceServices(
                    serviceId,
                    authToken
                );

                setData(data);
            } catch (error) {
                toast.error(error.message, { id: 'error' });
            }
        };
        detailService();
    }, [serviceId, authToken, refresh]);

    if (!authToken && !user) return <Navigate to='/' />;

    const deleteShiftRecord = async (e, shiftRecordId) => {
        e.preventDefault();
        try {
            const response = await fetchDeleteShiftRecordServices(
                authToken,
                shiftRecordId
            );
            toast.success(response.message, { id: 'ok' });
            setRefresh((prev) => !prev);
        } catch (error) {
            toast.error(error.message, { id: 'error' });
        }
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

    return (
        <section>
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
                    <p>Personas contratadas: {data.numberOfPeople}</p>
                    <p className='font-extrabold'>Total: {data.totalPrice}€</p>
                </fieldset>
            </form>
            {data.status !== 'completed' && data.status !== 'canceled' ? (
                <>
                    <form className='mx-auto'>
                        <fieldset>
                            <legend>Empleados asignados</legend>
                            {Array.isArray(data.employees) &&
                                data.employees.map((employee, index) => (
                                    <p key={index} className='mt-2'>
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
                <form className='mx-auto'>
                    <fieldset>
                        <legend>Empleado/s</legend>
                        {Array.isArray(data.employees) &&
                            data.employees.map((employee, index) => (
                                <>
                                    <div key={index}>
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
                                                key={index}
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
