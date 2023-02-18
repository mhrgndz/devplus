import { converBase64ToImage } from 'convert-base64-to-image'
import ResponseObject from "../objects/ResponseObject.js";
import ResponseCodes from "../objects/ResponseCodes.js";
import ErrorMessage from '../objects/ErrorMessage.js';
import db from "../client/db.js";
import Uuidv4 from "../utils/UuidUtil.js";
import fs from "fs";

class VehicleHandler {

    constructor () {
        this.uuid = new Uuidv4();
    }

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

        const vehicleResult = await this.selectVehicle(body);

        return new ResponseObject(vehicleResult.rows, ResponseCodes.OK);
    }

    async update(body) {

        if (!body.brand || !body.model || !body.vehicleId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const updateResult = await this.updateVehicle(body);

        return new ResponseObject(updateResult.rows, ResponseCodes.OK);
    }

    async delete(body) {

        if (!body.vehicleId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        await this.deleteVehicle(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async photoCreate(body) {

        if (!body.vehicleId || !Array.isArray(body.photoList)) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const selectVehicleResult = await this.selectVehiclePhoto(body);

        for (let i = 0; i < selectVehicleResult.rows.length; i++) {
            fs.unlinkSync(`${process.env.VEHICLE_IMAGE_PATH}${selectVehicleResult.rows[i].photo}${process.env.IMAGE_URL}`);
        }

        await this.deleteVehiclePhotos(body);

        const photoList = [];
        for (let i = 0; i < body.photoList.length; i++) {

            const pathName = await this.uuid.randomUuid();
            const pathToSaveImage = `${process.env.VEHICLE_IMAGE_PATH}${pathName}${process.env.IMAGE_URL}`;

            await converBase64ToImage(body.photoList[i], pathToSaveImage);

            photoList.push(`('${pathName}', ${i}, ${body.vehicleId})`);
        }
        body.photoList = photoList;

        await this.insertVehiclePhoto(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async insertVehicle(data) {

        const vehicleInsert = `insert into public.vehicles(brand, model, user_id) values ($1, $2, $3, $4)`;
        return await db.query(vehicleInsert, [data.brand, data.model, data.userId]);
    }

    async selectVehicle(data) {

        const vehicleSelect = `select * from vehicles where id=$1`;
        return await db.query(vehicleSelect, [data.vehicleId]);
    }

    async updateVehicle(data) {

        const vehicleUpdate = `update public.vehicles set brand=$2, model=$3, updated_date=now() where id=$1 returning*`;
        return await db.query(vehicleUpdate, [data.vehicleId, data.brand, data.model]);
    }

    async deleteVehicle(data) {

        const vehicleDelete = `delete from public.vehicles where id=$1`;
        await db.query(vehicleDelete, [data.vehicleId]);
    }

    async insertVehiclePhoto(data) {

		const insertVehiclePhotoQuery = `insert into vehicle_photos (photo, sort, vehicle_id) values ${data.photoList.join(",")} returning*`;
        return await db.query(insertVehiclePhotoQuery);
    }

    async selectVehiclePhoto(data) {

        const vehicleSelect = `select * from vehicle_photos where vehicle_id=$1`;
        return await db.query(vehicleSelect, [data.vehicleId]);
    }

    async deleteVehiclePhotos(data) {

        const vehicleDelete = `delete from public.vehicle_photos where vehicle_id=$1`;
        await db.query(vehicleDelete, [data.vehicleId]);
    }
}

export default VehicleHandler;