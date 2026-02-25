import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import selectUserByEmailService from '../../services/users/selectUserByEmailService.js';
import { SECRET, NODE_ENV, DOMAIN } from '../../../env.js';

const authLogTs = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

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

        if (!user || !validPassword) {
            console.warn(`${authLogTs()} [AUTH] Intento de login fallido - Contraseña incorrecta: ${email}`);
            generateErrorUtil('Usuario o contraseña incorrecto.', 401);
        }

        if (!user.active)
            generateErrorUtil('Usuario pendiente de activacion', 403);

        console.log(`${authLogTs()} [AUTH] Login exitoso: ${user.email} (${user.role})`);

        const tokenInfo = {
            id: user.id,
            role: user.role,
        };

        const dataToken = jwt.sign(tokenInfo, SECRET, {
            expiresIn: '7d',
        });


        res.cookie('authToken', dataToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            domain: DOMAIN,
            path: '/',
        });


        res.status(200).send({
            status: 'ok',
            message: `Bienvenid@ ${user.firstName}`,
        });
    } catch (error) {
        if (req.body?.email) {
            console.error(`${authLogTs()} [AUTH] Error en autenticación para ${req.body.email}:`, error?.message || error);
        }
        next(error);
    }
};

export default loginUserController;
