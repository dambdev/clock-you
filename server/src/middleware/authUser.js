import jwt from 'jsonwebtoken';
import generateErrorUtil from '../utils/generateErrorUtil.js';

import { SECRET } from '../../env.js';

const authUser = (req, res, next) => {
    try {
        const authorization = req.cookies.authToken;

        if (!authorization) {
            generateErrorUtil('Sesión caducada, por favor cierre sesión y vuelva a iniciar sesión', 401);
        }

        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, SECRET);
        } catch (error) {
            generateErrorUtil('Credenciales invalidas', 401);
        }

        req.userLogged = tokenInfo;

        next(); 
    } catch (error) {
        next(error);
    }
};

export default authUser;
