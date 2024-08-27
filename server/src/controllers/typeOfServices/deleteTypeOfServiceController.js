import deleteTypeOfServiceService from '../../services/typeOfServices/deleteTypeOfServiceService.js';

const deleteTypeOfServiceController = async (req, res, next) => {
    try {
        const { typeOfServiceId } = req.params;

        const data = await deleteTypeOfServiceService(typeOfServiceId);

        res.send({
            staus: 'ok',
            message: 'Tipo de servicio eliminado correctamente',
            data,
        });
    } catch (error) {
        next(error);
    }
};

export default deleteTypeOfServiceController;
