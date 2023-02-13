import ResponseObject from "../objects/ResponseObject.js";
import ResponseCodes from "../objects/ResponseCodes.js";
import ErrorMessage from '../objects/ErrorMessage.js';
import db from "../client/db.js";

class VehicleHandler {

    async create(body) {

        if (!body.brand || !body.model || !body.userId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        await this.insertVehicle(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async insertVehicle(body) {

        const vehicleInsert = `insert into public.vehicles(brand, model, note, user_id)
            VALUES ($1, $2, $3, $4);`;
        await db.query(vehicleInsert, [body.brand, body.model, body.note, body.userId]);
    }
}

export default VehicleHandler;