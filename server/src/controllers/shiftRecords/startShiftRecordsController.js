import startShiftRecordService from '../../services/shiftRecords/startShiftRecordService.js';

const startShiftRecordsController = async (req, res, next) => {
    try {
        const { shiftRecordId, location, clockIn } = req.body;

        await startShiftRecordService(shiftRecordId, location, clockIn);

        res.send({
            status: 'ok',
            message: 'Hora de inicio registrada',
        });
    } catch (error) {
        next(error);
    }
};

export default startShiftRecordsController;
