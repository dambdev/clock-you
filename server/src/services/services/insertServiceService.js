import { v4 as uuid } from 'uuid';
import { ADMIN_EMAIL } from '../../../env.js';
import { CLIENT_URL } from '../../../env.js';
import getPool from '../../db/getPool.js';
import Randomstring from 'randomstring';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import sendMailUtils from '../../utils/sendMailUtil.js';

const insertServiceService = async (
    typeOfServiceId,
    userId,
    startDateTime,
    endDateTime,
    hours,
    numberOfPeople,
    address,
    city,
    postCode,
    comments,
    totalPrice
) => {
    const pool = await getPool();

    const [verify] = await pool.query(
        `
        SELECT id FROM users WHERE id = ?
        `,
        [userId]
    );

    if (!verify.length || verify[0].id !== userId)
        generateErrorUtil('Acceso denegado, el token no coincide', 409);

    const [existAddress] = await pool.query(
        `
        SELECT id FROM addresses WHERE address = ? AND city = ? AND postCode = ?
        `,
        [address, city, postCode]
    );

    const [existService] = await pool.query(
        `
        SELECT id FROM services WHERE typeOfServicesId = ? AND clientId = ? AND startDateTime = ? AND endDateTime = ?  AND numberOfPeople = ? AND hours = ? AND deletedAt IS NULL
        `,
        [
            typeOfServiceId,
            userId,
            startDateTime,
            endDateTime,
            numberOfPeople,
            hours,
        ]
    );

    if (existAddress.length && existService.length)
        generateErrorUtil(
            'Ya has solicitado un servicio con estas características',
            401
        );

    const addressId = uuid();

    await pool.query(
        `
        INSERT INTO addresses(id, address, city, postCode) VALUES (?,?,?,?)
        `,
        [addressId, address, city, postCode]
    );

    const validationCode = Randomstring.generate(30);

    const serviceId = uuid();

    await pool.query(
        `
        INSERT INTO services(id, startDateTime, endDateTime, numberOfPeople, hours, comments, validationCode, clientId, addressId, typeOfServicesId, totalPrice) VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
            serviceId,
            startDateTime,
            endDateTime,
            numberOfPeople,
            hours,
            comments,
            validationCode,
            userId,
            addressId,
            typeOfServiceId,
            totalPrice,
        ]
    );

    const [data] = await pool.query(
        `
        SELECT s.status,
        t.type, t.city AS province, t.price, s.hours, s.totalPrice, s.startDateTime, s.endDateTime, s.numberOfPeople, a.address, a.postCode, a.city, s.comments, u.email, u.firstName, u.lastName, u.phone
        FROM addresses a
        INNER JOIN services s
        ON a.id = s.addressId
        INNER JOIN users u
        ON u.id = s.clientId
        INNER JOIN typeOfServices t
        ON s.typeOfServicesId = t.id
        WHERE u.id = ? AND s.id = ?
        `,
        [userId, serviceId]
    );

    const emailSubject = `Nuevo pedido`;

    const emailBody = `
    <html>
        <body>
            <table bgcolor="#3c3c3c" width="670" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto" > <tbody> <tr> <td> <table bgcolor="#3c3c3c" width="670" border="0" cellspacing="0" cellpadding="0" align="left" > <tbody> <tr> <td align="left" style=" padding: 20px 40px; color: #fff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; " > <p style=" margin: 10px 0 20px; font-size: 35px; font-weight: bold; color: #fff; " > <img src="https://raw.githubusercontent.com/DavidMiras/clock-you/main/client/public/logo-test.png" alt="Logo" style="width: 40px; margin: 0 -3px -10px 0" /> ClockYou </p> <p style="margin: 0 0 15px; font-size: 20px; color: #fff;"> ${data[0].type} en ${data[0].province}</p> <p style=" font-size: 18px; color: #fff;"> Por favor, asigne empleado/s para continuar con el proceso:</p> <p> <a style=" display: inline-block; margin: 25px 0; padding: 10px 25px 15px; background-color: #008aff; font-size: 20px; color: #fff; width: auto; text-decoration: none; font-weight: bold; " href="${CLIENT_URL}/services/${serviceId}" >Asignar</a > <p style="margin:0 0 2px; color: #fff;"> Gracias por confiar en nosotros. </p> <p style="margin: 0 0 10px; color: #fff;">&copy; ClockYou 2024</p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>
        </body>
    </html>
`;

    await sendMailUtils(ADMIN_EMAIL, emailSubject, emailBody);

    return data[0];
};

export default insertServiceService;
