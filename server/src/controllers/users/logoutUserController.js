const logoutUserController = (req, res, next) => {
    res.clearCookie('authToken').clearCookie('refreshToken').send({
        status: 'ok',
        message: 'Sesión cerrada correctamente',
    });
};

export default logoutUserController;
