import crypto from 'crypto';
import getPool from '../../db/getPool.js';
import sendMailUtils from '../../utils/sendMailUtil.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import { CLIENT_URL } from '../../../env.js';

const insertShiftRecordService = async (serviceId, employeeId) => {
    const pool = await getPool();

    const [created] = await pool.query(
        `
        SELECT serviceId FROM shiftRecords WHERE serviceId = ? AND employeeId = ?
        `,
        [serviceId, employeeId]
    );

    if (created.length) generateErrorUtil('El empleado ya está asignado', 401);

    const id = crypto.randomUUID();

    await pool.query(
        `
        INSERT INTO shiftRecords(id, employeeId, serviceId) VALUES(?,?,?)
        `,
        [id, employeeId, serviceId]
    );

    const [pedido] = await pool.query(
        `
        SELECT t.type, t.city AS province, s.status, s.validationCode, s.totalPrice, s.startDateTime, s.endDateTime, a.address, a.postCode, a.city, u.email
        FROM addresses a
        INNER JOIN services s
        ON a.id = s.addressId
        INNER JOIN users u
        ON u.id = s.clientId
        INNER JOIN typeOfServices t
        ON s.typeOfServicesId = t.id
        WHERE s.id = ? AND s.deletedAt IS NULL
        `,
        [serviceId]
    );

    if (pedido[0].status === 'pending') {
        const startTime = new Date(pedido[0].startDateTime).toLocaleTimeString(
            [],
            {
                hour: '2-digit',
                minute: '2-digit',
            }
        );
        const endTime = new Date(pedido[0].endDateTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const startDate = new Date(
            pedido[0].startDateTime
        ).toLocaleDateString();

        const emailSubject = `Su Servicio ha sido aceptado`;

        const emailBody = `
        <html>
            <body>
                <table bgcolor="#3c3c3c" width="670" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto" > <tbody> <tr> <td> <table bgcolor="#3c3c3c" width="670" border="0" cellspacing="0" cellpadding="0" align="left" > <tbody> <tr> <td align="left" style=" padding: 20px 40px; color: #fff; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; " > <p style=" margin: 10px 0 20px; font-size: 35px; font-weight: bold; color: #fff;" > <img src="https://raw.githubusercontent.com/DavidMiras/clock-you/main/client/public/logo-test.png" alt="Logo" style="width: 40px; margin: 0 -3px -10px 0" /> ClockYou </p> <p style="margin: 0 0 25px; font-size: 20px; color: #fff;"> Resumen de su pedido </p> <p style="margin: 0 0 10px; font-size: 16px; color: #fff;">${pedido[0].type} en ${pedido[0].province} </p> <p style="margin: 0 0 10px; font-size: 16px; color: #fff;">Día: ${startDate} de ${startTime} a ${endTime}</p> <p style="margin: 0 0 10px; font-size: 16px; color: #fff;">Dirección: ${pedido[0].address}, ${pedido[0].postCode}, ${pedido[0].city}</p> <p style="margin: 0 0 25px; font-size: 16px; color: #fff;"> Total: ${pedido[0].totalPrice}€ </p> <p style="margin: 0 0 5px; font-size: 18px; color: #fff;"> Por favor, confirme su petición haciendo click en el siguiente enlace: </p> <br /> <p> <a style=" display: inline-block; margin: 0 0 5px; padding: 10px 25px 15px; background-color: #008aff; font-size: 20px; color: #fff; width: auto; text-decoration: none; font-weight: bold; " href="${CLIENT_URL}/services/validate/${pedido[0].validationCode}" >Confirmar petición</a > </p> <p style="margin: 25px 0 2px; color: #fff;"> Gracias por confiar en ClockYou. </p> <p style="margin: 0 0 10px; color: #fff;">&copy; ClockYou 2024</p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>
            </body>
        </html>
    `;

        await sendMailUtils(pedido[0].email, emailSubject, emailBody);

        await pool.query(
            `
            UPDATE services SET status = 'accepted' WHERE id = ?
            `,
            [serviceId]
        );
    }
};

export default insertShiftRecordService;
