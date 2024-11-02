import { v4 as uuid } from 'uuid';
import sendMailUtils from '../../utils/sendMailUtil.js';
import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import { CLIENT_URL } from '../../../env.js';
import randomstring from 'randomstring';

const insertAdminService = async (
    role,
    email,
    firstName,
    lastName,
    dni,
    phone,
    job,
    city
) => {
    const pool = await getPool();

    const [user] = await pool.query(
        `
            SELECT id FROM users WHERE email = ?
        `,
        [email]
    );

    if (user.length) {
        generateErrorUtil('El email ya se encuentra registrado', 409);
    }

    const recoverPasswordCode = randomstring.generate(10);
    const defaultPassword = uuid();
    const id = uuid();

    await pool.query(
        `
              INSERT INTO users(id, email, firstName, lastName, password, dni, phone, recoverPasswordCode, role, job, city, active )
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
          `,
        [
            id,
            email,
            firstName,
            lastName,
            defaultPassword,
            dni,
            phone,
            recoverPasswordCode,
            role,
            job,
            city,
            1,
        ]
    );

    const emailSubject = `Tu cuenta de ClockYou ha sido creada`;

    const emailBody = `
    <html>
        <body>
        <table bgcolor="#3c3c3c" width="670" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto" > <tbody> <tr> <td> <table bgcolor="#3c3c3c" width="670" border="0" cellspacing="0" cellpadding="0" align="left" > <tbody> <tr> <td align="left" style=" padding: 20px 40px; color: #fff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; " > <p style=" margin: 10px 0 20px; font-size: 35px; font-weight: bold; color: #fff;" > <img src="https://raw.githubusercontent.com/DavidMiras/clock-you/main/client/public/logo-test.png" alt="Logo" style="width: 40px; margin: 0 -3px -10px 0" /> ClockYou </p> <p style="margin: 0 0 5px; font-size: 25px; color: #fff;"> Bienvenid@, ${firstName} ${lastName}!!! </p> <p style="margin: 15px 0 5px; font-size: 16px; color: #fff;"> Tu cuenta ha sido creada por la administración de ClockYou. <span style=" display: block; font-size: 16px; margin: 15px 0 0; color: #fff;" > Para continuar, modifica tu contraseña con el siguiente código de recuperación: ${recoverPasswordCode}, haciendo click en el siguiente enlace: </span> </p> <p> <a style=" display: inline-block; margin: 25px 0; padding: 10px 25px 15px; background-color: #008aff; font-size: 20px; color: #fff; width: auto; text-decoration: none; font-weight: bold; " href="${CLIENT_URL}/password" >Actualiza tu contraseña</a > </p> <p style="margin: 25px 0 10px; color: #fff;">&copy; ClockYou 2024</p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>
        </body>
    </html>
`;

    await sendMailUtils(email, emailSubject, emailBody);
};

export default insertAdminService;
