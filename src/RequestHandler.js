import db from './client/db.js';

class RequestHandler {

    constructor(event) {
        this.event = event;
    }

    async dispatch() {
        try {
            // const result = await db.query("select * from users");

            // console.log(result.rows)
        } catch (error) {
            console.log(error);
        } finally {

        }
        return "";
    }
}


export default RequestHandler