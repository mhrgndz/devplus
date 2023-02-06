import PathObject from '../objects/PathObject.js';
import Authentication from './Authentication.js';

class ValidateRequest {
    constructor() {
        this.PathObject = PathObject;
    }
    async validateRequest(req) {
        const verifyPathResult = await this.verifyFindPathObject(req.path);

        if (verifyPathResult) {
            return true;
        }

        const Aut = new Authentication();
        const verifyTokenResult = await Aut.verifyToken(req);

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