import db from '../client/db.js'
import PathObject from '../objects/PathObject.js';

class Authentication {
    constructor() {
        this.PathObject = PathObject;
    }
    async validateRequest(req) {
        const verifyPathResult = await this.verifyFindPathObject(req.path);

        if (verifyPathResult) {
            return true;
        }

        const verifyTokenResult = await this.verifyToken(req);

        if (verifyTokenResult) {
            return true;
        }

        return false;
    }
    async verifyFindPathObject(requestPath) {
        const findPath = this.PathObject.find(path => path === requestPath);

        return findPath;
    }
    async verifyToken(req) {
        const token = req.headers['accesstoken'];
        const tokenResult = await db.query("select id from users where is_enabled = true and access_token=$1",[token]);

        if(tokenResult.rows.length) {
            return true;
        }
        
        return false;
    }
}

export default Authentication;