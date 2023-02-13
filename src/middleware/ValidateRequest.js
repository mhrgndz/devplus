import PathObject from '../objects/PathObject.js';
import Authentication from './Authentication.js';
import ResponseObject from '../objects/ResponseObject.js';
import ErrorMessage from '../objects/ErrorMessage.js';
import ResponseCodes from '../objects/ResponseCodes.js';

class ValidateRequest {
    constructor() {
        this.PathObject = PathObject;
    }
    async validateRequest(req) {
        const verifyPathResult = await this.verifyPathObject(req.path);

        if (verifyPathResult) {
            return new ResponseObject({}, ResponseCodes.OK_WRITTEN);
        }

        const Aut = new Authentication();
        const verifyTokenResult = await Aut.verifyToken(req);

        if (!verifyTokenResult) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.INVALID_TOKEN);
        }

        return new ResponseObject({}, ResponseCodes.OK_WRITTEN);
    }
    async verifyPathObject(requestPath) {
        const findPath = this.PathObject.find(path => path === requestPath);

        return findPath;
    }
}

export default ValidateRequest;