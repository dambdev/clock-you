import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const updateServiceByIdService = async ({
    serviceId,
    address,
    postCode,
    city,
    comments,
    startDateTime,
    endDateTime,
    totalPrice,
    hours,
    numberOfPeople,
}) => {
    const pool = await getPool();

    const [status] = await pool.query(
        `
        SELECT id, status FROM services WHERE id = ?
        `,
        [serviceId]
    );

    if (!status.length || status[0].status !== 'pending')
        generateErrorUtil('El servicio ya no se puede modificar', 409);

    const [addressId] = await pool.query(
        `
        SELECT addressId FROM services WHERE id = ?
        `,
        [serviceId]
    );

    await pool.query(
        `
        UPDATE addresses SET address = ?, postCode = ?, city = ?
        WHERE id = ?
        `,
        [address, postCode, city, addressId[0].addressId]
    );

    await pool.query(
        `
        UPDATE services SET comments = ?, startDateTime = ?, endDateTime = ?, totalPrice = ?, hours = ?, numberOfPeople= ? WHERE id = ?
        `,
        [
            comments,
            startDateTime,
            endDateTime,
            totalPrice,
            hours,
            numberOfPeople,
            serviceId,
        ]
    );
};

export default updateServiceByIdService;
