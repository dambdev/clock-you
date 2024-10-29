import 'dotenv/config';

const {
    JAWSDB_URL,
    PORT,
    ADMIN_EMAIL,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_EMAIL,
    CLIENT_URL,
    UPLOADS_DIR,
} = process.env;

export {
    JAWSDB_URL,
    PORT,
    ADMIN_EMAIL,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_EMAIL,
    CLIENT_URL,
    UPLOADS_DIR,
};
