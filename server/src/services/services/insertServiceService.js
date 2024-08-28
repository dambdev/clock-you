import getPool from '../../db/getPool.js';
import Randomstring from 'randomstring';
import { v4 as uuid } from 'uuid';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const insertServiceService = async (
    typeOfServiceId,
    userId,
    dateTime,
    hours,
    comments,
    address,
    city,
    postCode
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
        SELECT id FROM services WHERE typeOfServicesId = ? AND clientId = ? AND dateTime = ? AND hours = ? AND deletedAt IS NULL
        `,
        [typeOfServiceId, userId, dateTime, hours]
    );

    if (existAddress.length && existService.length)
        generateErrorUtil(
            'Ya has solicitado un servicio con estas características',
            401
        );

    const [price] = await pool.query(
        `
        SELECT price FROM typeOfServices WHERE id = ?
        `,
        [typeOfServiceId]
    );

    const resultPrice = price[0].price * hours;

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
        INSERT INTO services(id, dateTime, hours, comments, validationCode, clientId, addressId, typeOfServicesId, totalPrice) VALUES (?,?,?,?,?,?,?,?,?)
        `,
        [
            serviceId,
            dateTime,
            hours,
            comments,
            validationCode,
            userId,
            addressId,
            typeOfServiceId,
            resultPrice,
        ]
    );

    const [data] = await pool.query(
        `
        SELECT s.status AS Estado,
        t.type AS TipoServicio, t.city AS Provincia, t.price AS PrecioHora, s.hours AS HorasContratadas, s.totalPrice AS PrecioTotal, s.dateTime AS DíaYHora, a.address AS Dirección, a.postCode AS CP, a.city AS Ciudad, s.comments AS Comenatarios, u.email AS Email, u.firstName AS Nombre, u.lastName AS Apellidos, u.phone AS Teléfono
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

    return data[0];
};

export default insertServiceService;
