import getPool from '../../db/getPool.js';

const selectServiceByEmployeeIdService = async (status, employeeId) => {
    const pool = await getPool();

    let sqlQuery = `
        SELECT s.id AS serviceId, s.status, t.type, s.startDateTime, s.endDateTime
        FROM shiftRecords sr
        INNER JOIN services s
        ON sr.serviceId = s.id
        INNER JOIN typeOfServices t
        ON t.id = s.typeOfServicesId
        WHERE sr.employeeId = ?
         
        `;

    let sqlValues = [employeeId];

    if (status) {
        sqlQuery += ' AND s.status = ?';
        sqlValues.push(status);
    }

    const [service] = await pool.query(sqlQuery, sqlValues);

    return service;
};

export default selectServiceByEmployeeIdService;
