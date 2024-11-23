import Joi from 'joi';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import updateServiceByIdService from '../../services/services/updateServiceByIdService.js';

const editServiceController = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            startDateTime: Joi.date().min('now').required(),
            endDateTime: Joi.date().min('now').required(),
            hours: Joi.number().min(1).max(8).required(),
            comments: Joi.string().max(500).required(),
            address: Joi.string().max(255).required(),
            city: Joi.string().max(40).required(),
            postCode: Joi.string().length(5).required(),
            totalPrice: Joi.number().required(),
            numberOfPeople: Joi.number().min(1).required(),
        });

        const validation = schema.validate(req.body);

        if (validation.error) generateErrorUtil(validation.error.message, 401);

        const { serviceId } = req.params;

        const {
            address,
            postCode,
            city,
            comments,
            startDateTime,
            endDateTime,
            totalPrice,
            hours,
            numberOfPeople,
        } = req.body;

        await updateServiceByIdService({
            serviceId,
            address,
            postCode,
            city,
            comments,
            startDateTime,
            endDateTime,
            totalPrice,
            hours,
            numberOfPeople,
        });

        res.send({
            status: 'ok',
            message: 'Servicio actualizado correctamente',
        });
    } catch (error) {
        next(error);
    }
};

export default editServiceController;
