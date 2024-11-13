import bcrypt from 'bcrypt';
import crypto from 'crypto';
import getPool from './getPool.js';
import {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME,
    ADMIN_DNI,
    ADMIN_PHONE,
} from '../../env.js';

const initDb = async () => {
    try {
        const pool = await getPool();

        console.log('Borrando tablas...');

        await pool.query(
            `
            DROP TABLE IF EXISTS shiftRecords, services, typeOfServices, users, addresses
            `
        );

        console.log('Creando tablas...');

        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS addresses (
                id CHAR(36) PRIMARY KEY NOT NULL,
                address VARCHAR(255) NOT NULL,
                postCode CHAR(5) NOT NULL,
                city VARCHAR(40) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modifiedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deletedAt TIMESTAMP )
            `
        );

        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) PRIMARY KEY NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                firstName VARCHAR(25) NOT NULL,
                lastName VARCHAR(50) NOT NULL,
                dni CHAR(11) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(15) NOT NULL,
                city VARCHAR(25),
                role ENUM('admin', 'employee', 'client') DEFAULT 'client',
                job VARCHAR(20),
                avatar CHAR(41),
                active BOOLEAN DEFAULT false,
                registrationCode CHAR(30),
                recoverPasswordCode CHAR(10),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                modifiedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deletedAt TIMESTAMP )
            `
        );

        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS typeOfServices (
                id CHAR(36) PRIMARY KEY NOT NULL,
                type VARCHAR(255) NOT NULL,
                price DECIMAL(5,2) NOT NULL,
                description VARCHAR(250) NOT NULL,
                city VARCHAR(30) NOT NULL,
                image CHAR(41),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modifiedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deletedAt TIMESTAMP )
            `
        );

        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS services (
                id CHAR(36) PRIMARY KEY NOT NULL,
                startDateTime TIMESTAMP NOT NULL,
                endDateTime TIMESTAMP NOT NULL,
                hours INT UNSIGNED NOT NULL CHECK (hours BETWEEN 1 AND 8),
                numberOfPeople INT UNSIGNED NOT NULL,
                rating INT UNSIGNED CHECK (rating BETWEEN 1 AND 5),
                totalPrice DECIMAL(10, 2) NOT NULL,
                comments VARCHAR(250) NOT NULL,
                status ENUM ('accepted', 'rejected', 'pending', 'completed', 'confirmed', 'canceled') DEFAULT 'pending',
                validationCode VARCHAR(30),
                clientId CHAR(36) NOT NULL,
                addressId CHAR(36) NOT NULL,
                typeOfServicesId CHAR(36) NOT NULL,
                FOREIGN KEY (clientId) REFERENCES users(id),
                FOREIGN KEY (addressId) REFERENCES addresses(id),
                FOREIGN KEY (typeOfServicesId) REFERENCES typeOfServices(id),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modifiedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deletedAt TIMESTAMP )
            `
        );

        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS shiftRecords(
                id CHAR(36) PRIMARY KEY NOT NULL,
                clockIn TIMESTAMP,
                clockOut TIMESTAMP,
                latitudeIn DECIMAL(10,8),
                longitudeIn DECIMAL(11,8),
                latitudeOut DECIMAL(10,8),
                longitudeOut DECIMAL(11,8),
                serviceId CHAR(36) NOT NULL,
                employeeId CHAR(36) NOT NULL,
                FOREIGN KEY (serviceId) REFERENCES services(id),
                FOREIGN KEY (employeeId) REFERENCES users(id),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modifiedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deletedAt TIMESTAMP )
            `
        );

        const hashedPass = await bcrypt.hash(ADMIN_PASSWORD, 10);

        await pool.query(
            `
            INSERT INTO users (id, firstName, lastName, phone, dni, email, password, role, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                crypto.randomUUID(),
                ADMIN_FIRST_NAME,
                ADMIN_LAST_NAME,
                ADMIN_PHONE,
                ADMIN_DNI,
                ADMIN_EMAIL,
                hashedPass,
                'admin',
                1,
            ]
        );

        console.log('¡Tablas creadas!');

        console.log('¡ADMIN creado!');
    } catch (err) {
        console.error('Error creando las tablas', err.message, err);
    } finally {
        process.exit();
    }
};

initDb();
