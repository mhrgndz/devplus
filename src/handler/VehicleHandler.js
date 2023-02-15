import ResponseObject from "../objects/ResponseObject.js";
import ResponseCodes from "../objects/ResponseCodes.js";
import ErrorMessage from '../objects/ErrorMessage.js';
import db from "../client/db.js";

class VehicleHandler {

    async create(body) {

        if (!body.brand || !body.model || !body.userId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const insertResult = await this.insertVehicle(body);

        return new ResponseObject(insertResult.rows, ResponseCodes.OK);
    }

    async get(body) {

        if (!body.vehicleId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const vehicleResult = await this.selectVehicleDetail(body);

        return new ResponseObject(vehicleResult.rows, ResponseCodes.OK);
    }

    async update(body) {

        if (!body.brand || !body.model || !body.vehicleId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const updateResult = await this.updateVehicleDetail(body);

        return new ResponseObject(updateResult.rows, ResponseCodes.OK);
    }

    async insertVehicle(data) {

        const vehicleInsert = `insert into public.vehicles(brand, model, note, user_id)
            VALUES ($1, $2, $3, $4) returning*`;
        return await db.query(vehicleInsert, [data.brand, data.model, data.note, data.userId]);
    }

    async selectVehicleDetail(data) {

        const vehicleSelect = `select * from vehicles where id=$1`;
        return await db.query(vehicleSelect, [data.vehicleId]);
    }

    async updateVehicleDetail(data) {

        const vehicleUpdate = `update public.vehicles SET brand=$2, model=$3, note=$4, updated_date=now() where id=$1 returning*`;
        return await db.query(vehicleUpdate, [data.vehicleId, data.brand, data.model, data.note]);
    }
}

export default VehicleHandler;