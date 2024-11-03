import Joi from 'joi';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import updateServiceService from '../../services/services/updateServiceService.js';

const validateServiceController = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            validationCode: Joi.string().length(30),
        });

        const validation = schema.validate(req.params);

        if (validation.error) generateErrorUtil(validation.error.message, 401);

        const { validationCode } = req.params;

        await updateServiceService(validationCode);

        res.send({
            status: 'ok',
            message: 'El servicio ha sido confirmado correctamente',
        });
    } catch (error) {
        next(error);
    }
};
export default validateServiceController;
