import { AuthContext } from '../../../context/AuthContext';
import { useState, useEffect, useContext } from 'react';
import {
    fetchDetailShiftRecordServices,
    fetchEditShiftRecordServices,
} from '../../../services/shiftRecordServices';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

const EditShiftRecordComponent = ({ shiftRecordId, onRequestClose }) => {
    const { authToken } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [clockIn, setClockIn] = useState('');
    const [clockOut, setClockOut] = useState('');

    useEffect(() => {
        const getDetailShiftRecord = async () => {
            try {
                const data = await fetchDetailShiftRecordServices(
                    shiftRecordId,
                    authToken
                );
                setData(data);
                setClockIn(data.clockIn);
                setClockOut(data.clockOut);
            } catch (error) {
                toast.error(error.message);
            }
        };

        getDetailShiftRecord();
    }, []);

    const handleEditShiftRecord = async (e) => {
        e.preventDefault();
        try {
            const formattedClockIn = new Date(clockIn)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');
            const formattedClockOut = new Date(clockOut)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');
            const data = await fetchEditShiftRecordServices(
                shiftRecordId,
                formattedClockIn,
                formattedClockOut,
                authToken
            );
            onRequestClose();
            toast.success(data.message, {
                id: 'ok',
            });
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    const entrada = new Date(data.clockIn).toLocaleString();
    const salida = new Date(data.clockOut).toLocaleString();

    return (
        <>
            <section className='mx-auto flex-1024'>
                <form className='profile-form' onSubmit={handleEditShiftRecord}>
                    <fieldset>
                        <p className='mt-2 font-extrabold'>
                            Entrada: {entrada}
                        </p>
                        <p className='font-extrabold'>Salida: {salida}</p>
                        <label htmlFor='clockin'>Entrada</label>
                        <input
                            id='clockin'
                            value={clockIn}
                            onChange={(e) => {
                                setClockIn(e.target.value);
                            }}
                            type='datetime-local'
                        />
                        <label htmlFor='clockin'>Salida</label>
                        <input
                            type='datetime-local'
                            htmlFor='clockout'
                            id='clockout'
                            value={clockOut}
                            onChange={(e) => setClockOut(e.target.value)}
                        />

                        <button className='mt-2'>Editar Turno</button>
                    </fieldset>
                </form>
            </section>
        </>
    );
};

const EditShiftRecordModal = ({ isOpen, onRequestClose, shiftRecordId }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='modal-content'
        >
            <EditShiftRecordComponent
                shiftRecordId={shiftRecordId}
                onRequestClose={onRequestClose}
            />
        </Modal>
    );
};

export default EditShiftRecordModal;
