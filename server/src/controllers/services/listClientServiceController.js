import selectServiceByClientIdService from '../../services/services/selectServiceByClientIdService.js';

const listClientServiceController = async (req, res, next) => {
    try {
        const clientId = req.userLogged.id;

        const { status, city, type, startDate, endDate } = req.query;

        const data = await selectServiceByClientIdService(
            clientId,
            status,
            city,
            type,
            startDate,
            endDate
        );

        res.send({
            status: 'ok',
            data,
        });
    } catch (error) {
        next(error);
    }
};

export default listClientServiceController;
