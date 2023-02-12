import { v4 as uuidv4 } from "uuid";
import db from "../client/db.js";
import ResponseObject from "../objects/ResponseObject.js";
import ResponseCodes from "../objects/ResponseCodes.js";
import ErrorCodes from '../objects/ErrorCodes.js';
import CryptoUtil from "../utils/CryptoUtil.js";

class UserHandler {

    constructor() {
        this.crypto = new CryptoUtil();
    }

    async signin(body) {

        if (!body.name || !body.surname || !body.email || !body.mobilePhone || !body.password) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorCodes.MISSING_PARAMETERS);
        }

        const signinResult = await db.query('select id from users where is_enabled=true and mobile_phone=$1', [body.mobilePhone]);

        if (signinResult.rowCount) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorCodes.INVALID_USER);
        }

        const encrytedPassword = await this.crypto.encrypt(body.password, process.env.USER_PASSWORD_KEY);

        await this.insertUser(body, encrytedPassword);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async login(body) {

        if (!body.mobilePhone || !body.password) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorCodes.MISSING_PARAMETERS);
        }

        const loginResult = await db.query('select access_token,id from users where is_enabled=true and mobile_phone=$1 and password=$2', [body.mobilePhone, body.password]);

        if (!loginResult.rowCount) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorCodes.INVALID_USER);
        }

        const token = uuidv4();

        await db.query('update users set access_token=$1 where id=$2', [token, loginResult.rows[0].id]);

        return new ResponseObject({ accessToken:token }, ResponseCodes.OK);
    }

    async insertUser(body, pw) {

        const signinInsert = `INSERT INTO public.users(name, surname, email, mobile_phone, password)
            VALUES ($1, $2, $3, $4, $5)`;
        await db.query(signinInsert, [body.name, body.surname, body.email, body.mobilePhone, pw]);
    }
}

export default UserHandler;