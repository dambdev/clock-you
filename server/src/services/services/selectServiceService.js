import getPool from '../../db/getPool.js';

const selectServiceService = async (status, type) => {
    const pool = await getPool();

    let sqlQuery = `
    SELECT s.id AS serviceId, s.status, t.type, s.startDateTime, s.endDateTime
    FROM addresses a
    INNER JOIN services s
    ON a.id = s.addressId
    INNER JOIN typeOfServices t
    ON s.typeOfServicesId = t.id
    `;

    let sqlValues = [];

    if (status) {
        sqlQuery += ' AND status = ?';
        sqlValues.push(status);
    }

    if (type) {
        sqlQuery += ' AND type = ?';
        sqlValues.push(type);
    }

    const [service] = await pool.query(sqlQuery, sqlValues);

    return service;
};
export default selectServiceService;
