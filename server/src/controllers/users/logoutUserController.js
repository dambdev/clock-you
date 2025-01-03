import { DOMAIN } from '../../../env.js';

const logoutUserController = (req, res, next) => {
    res.clearCookie('authToken', { path: '/', domain: DOMAIN });

    res.send({
        status: 'ok',
        message: 'Hasta pronto!',
    });
};

export default logoutUserController;
