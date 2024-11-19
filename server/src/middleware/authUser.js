import jwt from 'jsonwebtoken';
import generateErrorUtil from '../utils/generateErrorUtil.js';
import { SECRET } from '../../env.js';

const authUser = (req, res, next) => {
    try {
        const authorization = req.cookies.authToken;
        const refreshToken = req.cookies.refreshToken;

        if (!authorization) {
            if (!refreshToken) {
                generateErrorUtil('No se ha proporcionado un token', 401);
            } else {
                try {
                    const tokenInfo = jwt.verify(refreshToken, SECRET);
                    const newAccessToken = jwt.sign(
                        { id: tokenInfo.id, role: tokenInfo.role },
                        SECRET,
                        { expiresIn: '1h' }
                    );
                    res.cookie('authToken', newAccessToken, {
                        httpOnly: true,
                        secure: NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 1000 * 60 * 60,
                    });
                    req.userLogged = tokenInfo;
                } catch (error) {
                    generateErrorUtil('Refresh token inválido', 401);
                }
            }
        } else {
            let tokenInfo;
            try {
                tokenInfo = jwt.verify(authorization, SECRET);
                req.userLogged = tokenInfo;
            } catch (error) {
                generateErrorUtil('Credenciales inválidas', 401);
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default authUser;
