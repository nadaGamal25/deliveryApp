import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteImageFile = (fileName, uploadFolder) => {
    const filePath = path.join(__dirname, `../../uploads/${uploadFolder}`, fileName);
    console.log(filePath)
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
        }
    });
};