import Joi from 'joi';

import updateUserRegisterService from "../../services/users/updateUserRegisterService.js";
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const validateUserController = async (req,res,next) => {
    try {

        const schema = Joi.object().keys({
            registrationCode: Joi.string().min(30)
        });

        const validation = schema.validate(req.params);

        if(validation.error){
            generateErrorUtil(validation.error.message, 401);
        };
        
        const { registrationCode } = req.params;

        await updateUserRegisterService(registrationCode);

        res.send({
            status: 'ok',
            message: 'Usario activado correctamente'
        });

    } catch (error) {
        next(error);
    }
}

export default validateUserController;