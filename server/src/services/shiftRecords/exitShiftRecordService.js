import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const exitShiftRecordService = async (shiftRecordId, location, clockOut) => {
    const pool = await getPool();

    const [serviceId] = await pool.query(
        `
        SELECT serviceId FROM shiftRecords WHERE id = ?
        `,
        [shiftRecordId]
    );

    const [clockIn] = await pool.query(
        `
        SELECT clockIn FROM shiftRecords WHERE id = ?
        `,
        [shiftRecordId]
    );

    if (clockIn[0].clockIn === null)
        generateErrorUtil('No has registrado una hora de inicio', 401);

    const [verify] = await pool.query(
        `
        SELECT clockOut FROM shiftRecords WHERE id = ?
        `,
        [shiftRecordId]
    );

    if (verify[0].clockOut !== null)
        generateErrorUtil('Ya has registrado una hora de fin', 401);

    await pool.query(
        `
        UPDATE shiftRecords SET clockOut = ?, latitudeOut = ?, longitudeOut = ? WHERE id = ?
        `,
        [clockOut, location.lat, location.lng, shiftRecordId]
    );

    await pool.query(
        `
        UPDATE services SET status = 'completed' WHERE id = ?
        `,
        [serviceId[0].serviceId]
    );
};

export default exitShiftRecordService;
