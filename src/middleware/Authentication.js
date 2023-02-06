import db from '../client/db.js'
import PathObject from '../objects/PathObject.js';

class Authentication {
    constructor() {
        this.PathObject = PathObject;
    }
    async verifyToken(accessToken, requestPath) {
        const verifyPath = await this.findPathObject(requestPath);

        if (verifyPath) {
            return true;
        }

        const token = await db.query("select id from users where is_enabled = true and access_token=$1",[accessToken]);

        if(token.rows.length) {
            return true;
        }
        
        return false;
    }
    async findPathObject(requestPath) {
        const findPath = this.PathObject.find(path => path === requestPath);

        return findPath;
    }
}

export default Authentication;