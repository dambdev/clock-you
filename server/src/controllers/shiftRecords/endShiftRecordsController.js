import endShiftRecordService from '../../services/shiftRecords/endShiftRecordService.js';

const endShiftRecordsController = async (req, res, next) => {
    try {
        const { shiftRecordId, location, clockOut } = req.body;
        const endDateTime = new Date(clockOut);

        await endShiftRecordService(shiftRecordId, location, endDateTime);

        res.send({
            status: 'ok',
            message: 'Hora de finalizacón registrada',
        });
    } catch (error) {
        next(error);
    }
};

export default endShiftRecordsController;
