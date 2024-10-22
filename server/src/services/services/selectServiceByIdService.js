import getPool from '../../db/getPool.js';

const selectServiceByIdService = async (serviceId) => {
    const pool = await getPool();

    const [service] = await pool.query(
        `
        SELECT s.rating, s.status, t.type, t.city AS province, s.totalPrice, s.numberOfPeople, s.startDateTime, s.endDateTime, a.address, a.postCode, a.city, s.comments, u.email, u.firstName, u.lastName , u.phone, u.dni
        FROM services s
        INNER JOIN addresses a
        ON a.id = s.addressId
        LEFT JOIN shiftRecords sr
        ON sr.serviceId = s.id
        INNER JOIN users u
        ON u.id = s.clientId
        INNER JOIN typeOfServices t
        ON s.typeOfServicesId = t.id
        WHERE s.id = ? AND s.deletedAt IS NULL
        `,
        [serviceId]
    );

    const [employees] = await pool.query(
        `
        SELECT ue.firstName AS firstNameEmployee, ue.lastName AS lastNameEmployee, sr.id AS shiftRecordId, sr.clockIn, sr.clockOut, sr.latitudeIn, sr.longitudeIn, sr.latitudeOut, sr.longitudeOut,
        TIMESTAMPDIFF(HOUR, sr.clockIn, sr.clockOut) AS hoursWorked,
        MOD(TIMESTAMPDIFF(MINUTE, sr.clockIn, sr.clockOut), 60) AS minutesWorked
        FROM shiftRecords sr
        INNER JOIN users ue
        ON sr.employeeId = ue.id
        WHERE sr.serviceId = ?
        `,
        [serviceId]
    );

    return {
        ...service[0],
        employees,
    };
};

export default selectServiceByIdService;
