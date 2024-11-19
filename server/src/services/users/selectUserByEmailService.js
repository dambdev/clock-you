import getPool from '../../db/getPool.js';

const selectUserByEmailService = async (email) => {
    const pool = await getPool();

    const [user] = await pool.query(
        `
        SELECT id, firstName, password, email, role, recoverPasswordCode, active
        FROM users
        WHERE email = ?
        `,
        [email]
    );
    return user[0];
};

export default selectUserByEmailService;
