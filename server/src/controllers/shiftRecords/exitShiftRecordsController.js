import exitShiftRecordService from '../../services/shiftRecords/exitShiftRecordService.js';

const exitShiftRecordsController = async (req, res, next) => {
    try {
        const { shiftRecordId, location, clockOut } = req.body;

        const endDateTime = new Date(clockOut);

        await exitShiftRecordService(shiftRecordId, location, endDateTime);

        res.send({
            status: 'ok',
            message: 'Hora de finalizacón registrada',
        });
    } catch (error) {
        next(error);
    }
};

export default exitShiftRecordsController;
