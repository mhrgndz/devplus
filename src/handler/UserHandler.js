import ResponseObject from "../objects/ResponseObject.js";
import ResponseCodes from "../objects/ResponseCodes.js";
import ErrorMessage from '../objects/ErrorMessage.js';
import CryptoUtil from "../utils/CryptoUtil.js";
import Uuidv4 from "../utils/UuidUtil.js";
import db from "../client/db.js";

class UserHandler {

    constructor() {
        this.crypto = new CryptoUtil();
        this.uuid = new Uuidv4();
    }

    async signin(body) {

        if (!body.name || !body.surname || !body.email || !body.mobilePhone || !body.password) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const user = await this.getUser(body);

        if (user.rowCount) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.INVALID_USER);
        }

        const encrytedPassword = await this.crypto.encrypt(body.password, process.env.USER_PASSWORD_KEY);

        await this.insertUser(body, encrytedPassword);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async login(body) {

        if (!body.mobilePhone || !body.password) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const user = await this.getUser(body);

        if (!user.rowCount) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.INVALID_USER);
        }

        const decryptPassword = await this.crypto.decrypt(user.rows[0].password, process.env.USER_PASSWORD_KEY);

        if (decryptPassword !== body.password) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.INVALID_PASSWORD);
        }

        const token = await this.uuid.randomUuid();

        await this.updateUser(token, user);

        return new ResponseObject({ accessToken:token }, ResponseCodes.OK);
    }

    async insertUser(data, encrytedPassword) {

        const signinInsert = `insert into public.users(name, surname, email, mobile_phone, password)
            VALUES ($1, $2, $3, $4, $5)`;
        await db.query(signinInsert, [data.name, data.surname, data.email, data.mobilePhone, encrytedPassword]);
    }

    async updateUser(token, user) {
        
        await db.query('update users set access_token=$1 where id=$2', [token, user.rows[0].id]);
    }

    async getUser(data) {

        const user = await db.query('select * from users where is_enabled=true and mobile_phone=$1', [data.mobilePhone]);

        return user;
    }
}

export default UserHandler;