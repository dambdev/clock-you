import getPool from '../../db/getPool.js';

const selectServiceByEmployeeIdService = async (status, employeeId) => {
    const pool = await getPool();

    let sqlQuery = `
        SELECT sr.id AS shiftRecordId, sr.clockIn, sr.clockOut, sr.latitudeIn, sr.longitudeIn, sr.latitudeOut, sr.longitudeOut, s.id AS serviceId, s.rating, s.status, t.type, t.city AS province, s.totalPrice, s.startDateTime, s.endDateTime, a.address, a.postCode, a.city, s.comments, u.firstName, u.lastName , u.phone,
        TIMESTAMPDIFF(HOUR, sr.clockIn, sr.clockOut) AS hoursWorked,
        MOD(TIMESTAMPDIFF(MINUTE, sr.clockIn, sr.clockOut), 60) AS minutesWorked
        FROM services s
        INNER JOIN addresses a
        ON a.id = s.addressId
        LEFT JOIN shiftRecords sr
        ON sr.serviceId = s.id
        INNER JOIN users u
        ON u.id = s.clientId
        INNER JOIN typeOfServices t
        ON s.typeOfServicesId = t.id
        WHERE sr.employeeId = ? AND s.deletedAt IS NULL
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
