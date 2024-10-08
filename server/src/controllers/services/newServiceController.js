import Joi from 'joi';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import insertServiceService from '../../services/services/insertServiceService.js';

const newServiceController = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            startDateTime: Joi.date().min('now').required(),
            endDateTime: Joi.date().min('now').required(),
            hours: Joi.number().min(1).max(8).required(),
            numberOfPeople: Joi.number().min(1).required(),
            address: Joi.string().max(255).required(),
            city: Joi.string().max(40).required(),
            postCode: Joi.string().length(5).required(),
            comments: Joi.string().max(250).required(),
            totalPrice: Joi.number().required(),
        });

        const validation = schema.validate(req.body);

        if (validation.error) generateErrorUtil(validation.error.message, 401);

        const userId = req.userLogged.id;

        const { typeOfServiceId } = req.params;

        const {
            startDateTime,
            endDateTime,
            hours,
            numberOfPeople,
            address,
            city,
            postCode,
            comments,
            totalPrice,
        } = req.body;

        await insertServiceService(
            typeOfServiceId,
            userId,
            startDateTime,
            endDateTime,
            hours,
            numberOfPeople,
            address,
            city,
            postCode,
            comments,
            totalPrice
        );

        res.send({
            status: 'ok',
            message:
                'Servicio solicitado correctamente, en cuanto asignemos un empleado recibirá la información en su Correo Eléctronico',
        });
    } catch (error) {
        next(error);
    }
};

export default newServiceController;
