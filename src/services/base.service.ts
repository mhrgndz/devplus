import { Inject, Injectable } from '@nestjs/common';
import * as CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import DbService from "./db.service";

@Injectable()
export default class BaseService {
    constructor(@Inject(DbService) public readonly dbService: DbService) {}

    async readFile(path) {

        try {
            return await fs.promises.readFile(path);
        } catch (err) {
            console.error(err);
        }
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