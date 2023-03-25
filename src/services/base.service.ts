import { Inject, Injectable } from '@nestjs/common';
import { converBase64ToImage } from 'convert-base64-to-image'
import { readFileSync } from 'fs';
import { unlink } from 'node:fs/promises';
import * as CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import DbService from "./db.service";

@Injectable()
export default class BaseService {
    constructor(@Inject(DbService) public readonly dbService: DbService) {}

    async readFile(path) {
        try {
            return await readFileSync(path);
        } catch (err) {
            console.error(err);
        }
    }

    async savePhotoInFolder(photoList: string[], path: string, extension: string) {
        const photoName = await Promise.all(photoList.map(async (item) => {
            const pathName = await this.randomUuid();
            const pathToSaveImage = `${path}${pathName}${extension}`;
            await converBase64ToImage(item, pathToSaveImage);
            return pathName;
        }));
        
        return photoName;
    }

    async deletePhotoInFolder(dataList, path: string, extension: string) {
        dataList.map(async (data) => {
            const photoPath = `${path}${data.photo}${extension}`;
            try {
                await unlink(photoPath);
            } catch (err) {
                console.error(err);
            }
        });
    }

    async decrypt(data: string, secret:string) {
        const bytes = CryptoJS.AES.decrypt(data, secret);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    async encrypt(data: string, secret:string) {
        return CryptoJS.AES.encrypt(data, secret).toString();
    }

    async randomUuid(): Promise<string> {
        return uuidv4();
    }
}