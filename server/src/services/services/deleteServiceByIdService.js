import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const deleteServiceByIdService = async (userId, serviceId) => {
    const pool = await getPool();

    const [verifyId] = await pool.query(
        `
        SELECT id FROM users WHERE id = ?
        `,
        [userId]
    );

    if (!verifyId.length)
        generateErrorUtil('Acceso denegado, el token no coincide', 409);

    const [verifyStatus] = await pool.query(
        `
        SELECT id, status FROM services WHERE id = ?
        `,
        [serviceId]
    );

    if (!verifyStatus.length || verifyStatus[0].status !== 'pending')
        generateErrorUtil(
            'No puedes eliminar el servicio debido a su estado',
            401
        );

    const [addressId] = await pool.query(
        `
            SELECT addressId FROM services WHERE id = ?
            `,
        [serviceId]
    );

    await pool.query(
        `
        UPDATE services SET deletedAt = CURRENT_TIMESTAMP, status = 'canceled' WHERE id = ?
        `,
        [serviceId]
    );

    await pool.query(
        `
            UPDATE addresses SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?
            `,
        [addressId[0].addressId]
    );
};

export default deleteServiceByIdService;
