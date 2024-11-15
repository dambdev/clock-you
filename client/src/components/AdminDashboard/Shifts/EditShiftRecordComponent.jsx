import Modal from 'react-modal';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { AuthContext } from '../../../context/AuthContext';
import { useState, useEffect, useContext } from 'react';
import {
    fetchDetailShiftRecordServices,
    fetchEditShiftRecordServices,
} from '../../../services/shiftRecordServices';

const EditShiftRecordComponent = ({
    shiftRecordId,
    onRequestClose,
    onEditSuccess,
}) => {
    const { authToken } = useContext(AuthContext);

    const [clockIn, setClockIn] = useState('');
    const [clockOut, setClockOut] = useState('');

    useEffect(() => {
        const getDetailShiftRecord = async () => {
            try {
                const data = await fetchDetailShiftRecordServices(
                    shiftRecordId,
                    authToken
                );

                const formatDateToLocal = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                };

                const clockIn = data.clockIn
                    ? formatDateToLocal(new Date(data.clockIn))
                    : 'null';
                const clockOut = data.clockOut
                    ? formatDateToLocal(new Date(data.clockOut))
                    : 'null';

                {
                    clockIn && setClockIn(clockIn);
                }
                {
                    clockOut && setClockOut(clockOut);
                }
            } catch (error) {
                toast.error(error.message, { id: 'error' });
            }
        };

        getDetailShiftRecord();
    }, [authToken]);

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

            toast.success(data.message, {
                id: 'ok',
            });

            onRequestClose();
            onEditSuccess();
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    return (
        <section className='mx-auto'>
            <form onSubmit={handleEditShiftRecord}>
                <fieldset>
                    <legend>Horarios</legend>
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

                    <button className='mt-2'>Guardar</button>
                </fieldset>
            </form>
        </section>
    );
};

const EditShiftRecordModal = ({
    isOpen,
    onRequestClose,
    shiftRecordId,
    onEditSuccess,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='modal-content'
        >
            <EditShiftRecordComponent
                shiftRecordId={shiftRecordId}
                onRequestClose={onRequestClose}
                onEditSuccess={onEditSuccess}
            />
        </Modal>
    );
};

export default EditShiftRecordModal;

EditShiftRecordModal.propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    shiftRecordId: PropTypes.string,
    onEditSuccess: PropTypes.func,
};

EditShiftRecordComponent.propTypes = {
    shiftRecordId: PropTypes.string,
    onRequestClose: PropTypes.func.isRequired,
    onEditSuccess: PropTypes.func.isRequired,
};
