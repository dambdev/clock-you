import toast from 'react-hot-toast';
import EditShiftRecordModal from './EditShiftRecordComponent';
import { VITE_API_URL } from '../../../../env.local.js';
import { fetchAllShiftRecordsServices } from '../../../services/shiftRecordServices';
import { useEffect, useState } from 'react';
import { FaStar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const ShiftsComponent = () => {
    const [details, setDetails] = useState([]);
    const [totals, setTotals] = useState([]);
    const [employeeId, setEmployeeId] = useState('');
    const [typeOfService, setTypeOfService] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedShiftRecordId, setSelectedShiftRecordId] = useState(null);
    const [generateExcel, setGenerateExcel] = useState(false);
    const [loading, setLoading] = useState(true);

    const getShifts = async () => {
        const searchParams = new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
            employeeId: employeeId,
            typeOfService: typeOfService,
            generateExcel: generateExcel,
        });
        const searchParamsToString = searchParams.toString();
        try {
            const response = await fetchAllShiftRecordsServices(
                searchParamsToString
            );

            setDetails(response.details);
            setTotals(response.totals);
            setLoading(false);

            if (generateExcel && response.excelFilePath) {
                window.open(
                    `${VITE_API_URL}/${response.excelFilePath}`,
                    '_blank'
                );
            }

            setGenerateExcel(false);
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    useEffect(() => {
        getShifts();
    }, [employeeId, typeOfService, startDate, endDate, generateExcel]);

    const employeeList = totals
        .map((shiftRecord) => {
            return {
                id: shiftRecord.employeeId,
                firstName: shiftRecord.firstName,
                lastName: shiftRecord.lastName,
            };
        })
        .filter(
            (employee, index, self) =>
                index ===
                self.findIndex(
                    (o) =>
                        o.id === employee.id &&
                        o.firstName === employee.firstName
                )
        )
        .sort((a, b) => a.firstName.localeCompare(b.firstName));

    const typeNoRepeated = [...new Set(details.map((item) => item.type))].sort(
        (a, b) => a.localeCompare(b)
    );

    const resetFilter = (e) => {
        e.preventDefault();
        setEmployeeId('');
        setTypeOfService('');
        setStartDate('');
        setEndDate('');
    };

    const openModal = (shiftRecordId) => {
        setSelectedShiftRecordId(shiftRecordId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedShiftRecordId(null);
    };

    if (loading) return null;

    return (
        <>
            <form className='form-filters'>
                <input
                    id='startDate'
                    type='datetime-local'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    id='endDate'
                    type='datetime-local'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <select
                    name='employeeId'
                    id='employeeId'
                    value={employeeId}
                    onChange={(e) => {
                        setEmployeeId(e.target.value);
                    }}
                >
                    <option value='' disabled>
                        Empleado:
                    </option>
                    {employeeList.map((employee, index) => (
                        <option
                            key={index + '-' + employee.id}
                            value={employee.id}
                        >
                            {`${employee.firstName} ${employee.lastName}`}
                        </option>
                    ))}
                </select>
                <select
                    name='typeOfService'
                    id='typeOfService'
                    value={typeOfService}
                    onChange={(e) => setTypeOfService(e.target.value)}
                >
                    <option value='' disabled>
                        Servicio:
                    </option>
                    {typeNoRepeated.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <button onClick={resetFilter}>Limpiar Filtros</button>
                <button type='button' onClick={() => setGenerateExcel(true)}>
                    Generar Excel
                </button>
            </form>
            <ul className='cards'>
                {totals.map((total, index) => (
                    <li
                        key={index + '-' + total.employeeId}
                        className='relative'
                    >
                        <h3>{`${total.firstName} ${total.lastName}`}</h3>
                        <p className='mb-2'>
                            Lleva trabajado: {total.totalHoursWorked} Horas y{' '}
                            {total.totalMinutesWorked} Minutos
                        </p>
                    </li>
                ))}
            </ul>
            <ul className='cards'>
                {details.map((item) => {
                    const clockIn = item.clockIn
                        ? new Date(item.clockIn).toLocaleString()
                        : null;
                    const clockOut = item.clockOut
                        ? new Date(item.clockOut).toLocaleString()
                        : null;
                    const startDateTime = item.startDateTime
                        ? new Date(item.startDateTime).toLocaleString()
                        : null;

                    return (
                        <li key={item.id} className='relative'>
                            <div className='icon-container'>
                                {item.status === 'completed' ? (
                                    <FaCheckCircle className='text-green-500' />
                                ) : (
                                    <FaExclamationCircle className='text-yellow-500' />
                                )}
                            </div>
                            <h3>{`${item.firstName} ${item.lastName}`}</h3>
                            <p>{item.province}</p>
                            <p>{item.type}</p>
                            <p className='grow'>
                                En {item.address}, {item.city}
                            </p>
                            <p>Horas contratadas: {item.hours}</p>
                            {startDateTime && (
                                <p className='font-extrabold'>
                                    Previsto: {startDateTime}
                                </p>
                            )}
                            {clockIn && <p>Entrada: {clockIn}</p>}
                            {clockOut && <p>Salida: {clockOut}</p>}
                            {item.totalHoursWorked !== null ||
                            item.totalMinutesWorked !== null ? (
                                <p>
                                    Total: {item.hoursWorked} Horas{' '}
                                    {item.minutesWorked} Minutos
                                </p>
                            ) : null}
                            {item.status === 'completed' && (
                                <div className='flex my-2'>
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={`${item.id}-${index}`}
                                            size={30}
                                            color={
                                                index + 1 <= item.rating
                                                    ? '#ffc107'
                                                    : '#e4e5e9'
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                            <button onClick={() => openModal(item.id)}>
                                Editar
                            </button>
                        </li>
                    );
                })}
            </ul>
            <EditShiftRecordModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                shiftRecordId={selectedShiftRecordId}
                onEditSuccess={getShifts}
            />
        </>
    );
};

export default ShiftsComponent;
