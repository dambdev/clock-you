import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import selectUserByEmailService from '../../services/users/selectUserByEmailService.js';
import { SECRET, NODE_ENV } from '../../../env.js';

const loginUserController = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(50).required(),
        });

        const validation = schema.validate(req.body);

        if (validation.error) generateErrorUtil(validation.error.message, 401);

        const { email, password } = req.body;

        const user = await selectUserByEmailService(email);

        let validPassword;

        if (user) validPassword = await bcrypt.compare(password, user.password);

        if (!user || !validPassword)
            generateErrorUtil('Usuario o contraseña incorrecto.', 401);

        if (!user.active)
            generateErrorUtil('Usuario pendiente de activacion', 403);

        const tokenInfo = {
            id: user.id,
            role: user.role,
        };

        const token = jwt.sign(tokenInfo, SECRET, {
            expiresIn: '1h',
        });

        const refreshToken = jwt.sign(tokenInfo, SECRET, {
            expiresIn: '7d',
        });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            domain: '.damb.dev',
        })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 7,
                domain: '.damb.dev',
            })
            .send({
                status: 'ok',
                message: `Bienvenid@ ${user.firstName}`,
                token,
                refreshToken,
            });
    } catch (error) {
        next(error);
    }
};

export default loginUserController;
