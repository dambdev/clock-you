import deleteShiftRecordService from '../../services/shiftRecords/deleteShiftRecordService.js';

const deleteShiftRecordController = async (req, res, next) => {
    try {
        const { shiftRecordId } = req.params;

        await deleteShiftRecordService(shiftRecordId);

        res.send({
            status: 'ok',
            message: 'Empleado eliminado correctamente',
        });
    } catch (error) {
        next(error);
    }
};
export default deleteShiftRecordController;
