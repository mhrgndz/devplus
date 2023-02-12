import UserHandler from "./handler/UserHandler.js";

class RequestHandler {

    constructor(event) {
        this.event = event;
        this.userInstance = new UserHandler();
        this.funcMap = {
            "user": this.userInstance,
        };

        this.findPath(event);
    }
    
    async findPath() {
        this.pathObject = this.event.path.split("/").filter(item => {return item !== ""});
        this.handler = this.pathObject[1];
        this.func = this.pathObject[2];
    }

    async dispatch() {
        let result;

        try {
            result = await this.funcMap[this.handler][this.func]();
        } catch (error) {
            console.log(error);
        } finally {

        }
        return result;
    }
}


export default RequestHandler