import exitShiftRecordService from '../../services/shiftRecords/exitShiftRecordService.js';

const exitShiftRecordsController = async (req, res, next) => {
    try {
        const { shiftRecordId, location, clockOut } = req.body;

        await exitShiftRecordService(shiftRecordId, location, clockOut);

        res.send({
            status: 'ok',
            message: 'Hora de finalizacón registrada',
        });
    } catch (error) {
        next(error);
    }
};

export default exitShiftRecordsController;
