import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';
import generateErrorUtil from './generateErrorUtil.js';
import { UPLOADS_DIR } from '../../env.js';

export const savePictureUtil = async (img, width, height) => {
    try {
        const uploadDir = path.join(process.cwd(), `/${UPLOADS_DIR}`);

        try {
            await fs.access(uploadDir);
        } catch (error) {
            await fs.mkdir(uploadDir);
        }

        const sharpImg = sharp(img.data);

        sharpImg.resize({ width, height });

        const imgName = `${crypto.randomUUID()}.jpg`;

        const pathImg = path.join(uploadDir, imgName);

        await sharpImg.toFile(pathImg);

        return imgName;
    } catch (error) {
        generateErrorUtil('Error al guardar imagen', 500);
    }
};

export const deletePictureUtil = async (imgName) => {
    try {
        const imagePath = path.join(process.cwd(), `/${UPLOADS_DIR}`, imgName);

        try {
            await fs.access(imagePath);
        } catch (error) {
            return;
        }

        await fs.unlink(imagePath);
    } catch (error) {
        generateErrorUtil('Error al eliminar archivo', 500);
    }
};
