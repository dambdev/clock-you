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
                const response = await fetchDetailShiftRecordServices(
                    shiftRecordId
                );

                const formatDateToLocal = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                };

                const clockIn = response.clockIn
                    ? formatDateToLocal(new Date(response.clockIn))
                    : 'null';
                const clockOut = response.clockOut
                    ? formatDateToLocal(new Date(response.clockOut))
                    : 'null';

                setClockIn(clockIn);
                setClockOut(clockOut);
            } catch (error) {
                toast.error(error.message, { id: 'error' });
            }
        };

        getDetailShiftRecord();
    }, [authToken]);

    const handleEditShiftRecord = async (e) => {
        e.preventDefault();
        const formattedClockIn = new Date(clockIn)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
        const formattedClockOut = new Date(clockOut)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
        toast.promise(
            fetchEditShiftRecordServices(
                shiftRecordId,
                formattedClockIn,
                formattedClockOut
            ),
            {
                loading: 'Editando horario...',
                success: (response) => {
                    return response;
                },
                error: (error) => {
                    return error.message;
                },
            }
        );

        onRequestClose();
        onEditSuccess();
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
