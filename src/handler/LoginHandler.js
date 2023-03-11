import ResponseObject from "../objects/ResponseObject.js";
import ResponseCodes from "../objects/ResponseCodes.js";
import ErrorMessage from '../objects/ErrorMessage.js';
import CryptoUtil from "../utils/CryptoUtil.js";
import Util from "../utils/Util.js";
import db from "../client/db.js";

class LoginHandler {

    constructor() {
        this.crypto = new CryptoUtil();
        this.util = new Util();
    }

    async login(body) {

        if (!body.mobilePhone || !body.password) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const user = await this.selectUser(body);

        if (!user.rowCount) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.INVALID_USER);
        }

        const decryptPassword = await this.crypto.decrypt(user.rows[0].password, process.env.USER_PASSWORD_KEY);

        if (decryptPassword !== body.password) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.INVALID_PASSWORD);
        }

        const token = await this.util.randomUuid();

        await this.updateUser(token, user);

        return new ResponseObject({ accessToken:token }, ResponseCodes.OK);
    }

    async updateUser(token, user) {
        
        await db.query('update users set access_token=$1 where id=$2', [token, user.rows[0].id]);
    }

    async selectUser(data) {

        const user = await db.query('select * from users where is_enabled=true and mobile_phone=$1', [data.mobilePhone]);

        return user;
    }
}

export default LoginHandler;