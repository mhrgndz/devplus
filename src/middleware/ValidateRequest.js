import PathObject from '../objects/PathObject.js';
import Authentication from './Authentication.js';

class ValidateRequest {
    constructor() {
        this.PathObject = PathObject;
        this.Authentication = new Authentication;
    }
    async validateRequest(req) {
        const verifyPathResult = await this.verifyFindPathObject(req.path);

        if (verifyPathResult) {
            return true;
        }

        const verifyTokenResult = await this.Authentication.verifyToken(req);

        if (verifyTokenResult) {
            return true;
        }

        return false;
    }
    async verifyFindPathObject(requestPath) {
        const findPath = this.PathObject.find(path => path === requestPath);

        return findPath;
    }
}

export default ValidateRequest;