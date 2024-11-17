import bcrypt from 'bcrypt';
import crypto from 'crypto';
import getPool from '../../db/getPool.js';
import sendMailUtil from '../../utils/sendMailUtil.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import { CLIENT_URL, SALT_ROUNDS } from '../../../env.js';

const insertUserService = async (
    email,
    password,
    firstName,
    lastName,
    dni,
    phone,
    registrationCode
) => {
    const pool = await getPool();

    const [verifyEmail] = await pool.query(
        `
        SELECT id FROM users WHERE email = ?
        `,
        [email]
    );

    if (verifyEmail.length)
        generateErrorUtil('El email ya se encuentra registrado', 409);

    const [verifyDni] = await pool.query(
        `
        SELECT id FROM users WHERE dni = ?
        `,
        [dni]
    );

    if (verifyDni.length)
        generateErrorUtil('El DNI/NIE ya se encuentra registrado', 409);

    const passwordHashed = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query(
        `
        INSERT INTO users(id, email, password, firstName, lastName, dni, phone, registrationCode )
        VALUES (?,?,?,?,?,?,?,?)
        `,
        [
            crypto.randomUUID(),
            email,
            passwordHashed,
            firstName,
            lastName,
            dni,
            phone,
            registrationCode,
        ]
    );

    const emailSubject = `Activa tu cuenta de ClockYou`;

    const emailBody = `
    <html>
        <body>
            <table bgcolor="#3c3c3c" width="670" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto" > <tbody> <tr> <td> <table bgcolor="#3c3c3c" width="670" border="0" cellspacing="0" cellpadding="0" align="left" > <tbody> <tr> <td align="left" style=" padding: 20px 40px; color: #fff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; " > <p style=" margin: 10px 0 20px; font-size: 35px; font-weight: bold; color: #fff;" > <img src="https://raw.githubusercontent.com/DavidMiras/clock-you/main/client/public/logo-test.png" alt="Logo" style="width: 40px; margin: 0 -3px -10px 0" /> ClockYou </p> <p style="margin: 0 0 5px; font-size: 25px; color: #fff;"> Bienvenid@, ${firstName} ${lastName}!!! </p> <p style="margin: 15px 0 5px; font-size: 16px; color: #fff;"> Muchas gracias por registrarte en ClockYou. <span style=" display: block; font-size: 16px; margin: 15px 0 0; color: #fff;" > Para continuar, activa tu cuenta haciendo click en el siguiente enlace: </span> </p> <p> <a style=" display: inline-block; margin: 25px 0; padding: 10px 25px 15px; background-color: #008aff; font-size: 20px; color: #fff; width: auto; text-decoration: none; font-weight: bold; " href="${CLIENT_URL}/users/validate/${registrationCode}" >Activa tu cuenta</a > </p> <p style="margin: 25px 0 10px; color: #fff;">&copy; ClockYou 2024</p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>
        </body>
    </html>
`;

    await sendMailUtil(email, emailSubject, emailBody);
};

export default insertUserService;
