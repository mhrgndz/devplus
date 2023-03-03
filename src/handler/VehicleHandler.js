import db from "../client/db.js";
import fs from "fs";
import { converBase64ToImage } from 'convert-base64-to-image'
import ResponseObject from "../objects/ResponseObject.js";
import ResponseCodes from "../objects/ResponseCodes.js";
import ErrorMessage from '../objects/ErrorMessage.js';
import Util from '../utils/Util.js';

class VehicleHandler {

    constructor () {
        this.util = new Util();
    }

    async create(body) {

        if (!body.brand || !body.model || !body.userId || !body.numberPlate) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const insertResult = await this.insertVehicle(body);

        return new ResponseObject(insertResult.rows, ResponseCodes.OK);
    }

    async update(body) {

        if (!body.brand || !body.model || !body.vehicleId || !body.numberPlate) {
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

    async get(body) {

        if (!body.vehicleId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const vehicleResult = await this.selectVehicle(body);

        return new ResponseObject(vehicleResult.rows, ResponseCodes.OK);
    }

    async photoCreate(body) {
        
        if (!body.vehicleId || !Array.isArray(body.photoList) || !body.stepStatus) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const selectVehicleResult = await this.selectVehiclePhoto(body);

        await this.deletePhotoInFolder(selectVehicleResult.rows);
        await this.deleteVehiclePhoto(body);

        const photoName = await this.savePhotoInFolder(body.photoList);

        const photoList = [];
        for (let i = 0; i < body.photoList.length; i++) {
            photoList.push(`('${photoName[i]}', ${i}, ${body.vehicleId}, ${body.stepStatus})`);
        }
        body.photoList = photoList;

        await this.insertVehiclePhoto(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async photoUpdate(body) {

        if (!body.vehicleId || !body.id || !Array.isArray(body.photoList)) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const selectVehicleResult = await this.selectVehiclePhoto(body);
        
        await this.deletePhotoInFolder(selectVehicleResult.rows);
        body.photo = (await this.savePhotoInFolder(body.photoList))[0];
        await this.updateVehiclePhoto(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async photoDelete(body) {

        if (!body.vehicleId || !body.id) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const selectVehicleResult = await this.selectVehiclePhoto(body);
        
        await this.deletePhotoInFolder(selectVehicleResult.rows);

        await this.deleteVehiclePhoto(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async photoGet(body) {

        if (!body.vehicleId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const selectPhotoResult = await this.selectVehiclePhoto(body);

        const response = [];
        for (let i = 0; i < selectPhotoResult.rows.length; i++) {

            const photo = await this.util.readFile(`${process.env.VEHICLE_IMAGE_PATH}${selectPhotoResult.rows[i].photo}${process.env.IMAGE_URL}`)

            response.push({
                vehicleId: selectPhotoResult.rows[i].vehicle_id,
                id: selectPhotoResult.rows[i].id,
                sort: selectPhotoResult.rows[i].sort,
                stepStatus: selectPhotoResult.rows[i].step_status,
                photo: "data:image/jpeg;base64," + Buffer.from(photo).toString("base64")
            });
        }

        return new ResponseObject(response, ResponseCodes.OK);
    }
    
    async noteCreate(body) {

        if (!body.vehicleId || !body.userId || !body.type || !body.note || !body.stepStatus) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        await this.insertNote(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async noteUpdate(body) {

        if (!body.id || !body.note) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const updateResult = await this.updateNote(body);

        return new ResponseObject(updateResult.rows, ResponseCodes.OK);
    }

    async noteDelete(body) {

        if (!body.id) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        await this.deleteNote(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async noteGet(body) {

        if (!body.vehicleId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const noteResult = await this.selectVehicleNote(body);

        return new ResponseObject(noteResult.rows, ResponseCodes.OK);
    }

    async processCreate(body) {

        if (!body.vehicleId || !body.stockId || !body.status) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        await this.insertVehicleProcess(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async processUpdate(body) {

        if (!body.id || !body.status) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const updateResult = await this.updateVehicleProcess(body);

        return new ResponseObject(updateResult.rows, ResponseCodes.OK);
    }

    async processDelete(body) {

        if (!body.id) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        await this.deleteVehicleProcess(body);

        return new ResponseObject({}, ResponseCodes.OK);
    }

    async processGet(body) {

        if (!body.vehicleId) {
            return new ResponseObject({}, ResponseCodes.ERROR, ErrorMessage.MISSING_PARAMETERS);
        }

        const result = await this.selectVehicleProcess(body);

        return new ResponseObject(result.rows, ResponseCodes.OK);
    }

    // #region Private methods

    async insertVehicle(data) {

        const vehicleInsert = `insert into public.vehicles(brand, model, user_id, number_plate) values ($1, $2, $3, $4)`;
        return await db.query(vehicleInsert, [data.brand, data.model, data.userId, data.numberPlate.toUpperCase().replace(/\s/g, '')]);
    }

    async selectVehicle(data) {

        const vehicleSelect = `select * from vehicles where id=$1`;
        return await db.query(vehicleSelect, [data.vehicleId]);
    }

    async updateVehicle(data) {

        const vehicleUpdate = `update public.vehicles set brand=$2, model=$3, number_plate=$4, updated_date=now() where id=$1 returning*`;
        return await db.query(vehicleUpdate, [data.vehicleId, data.brand, data.model, data.numberPlate.toUpperCase().replace(/\s/g, '')]);
    }

    async deleteVehicle(data) {

        const vehicleDelete = `delete from public.vehicles where id=$1`;
        await db.query(vehicleDelete, [data.vehicleId]);
    }

    async insertVehiclePhoto(data) {

		const insertVehiclePhotoQuery = `insert into vehicle_photos (photo, sort, vehicle_id, step_status) values ${data.photoList.join(",")}`;
        return await db.query(insertVehiclePhotoQuery);
    }

    async selectVehiclePhoto(data) {

        const vehicleSelect = `select * from vehicle_photos where vehicle_id=$1 and ((id = $2) or ($2 = -1)) and ((step_status = $3) or ($3 = -1)) order by sort`;
        return await db.query(vehicleSelect, [data.vehicleId, data.id || -1, data.stepStatus || -1]);
    }

    async deleteVehiclePhoto(data) {

        const vehicleDelete = `delete from public.vehicle_photos where vehicle_id=$1 and ((id = $2) or ($2 = -1))`;
        await db.query(vehicleDelete, [data.vehicleId, data.id || -1]);
    }

    async updateVehiclePhoto(data) {

        const vehicleUpdate = `update public.vehicle_photos set photo=$2, updated_date=now() where id=$1`;
        return await db.query(vehicleUpdate, [data.id, data.photo]);
    }

    async deletePhotoInFolder(data) {

        try {
            for (let i = 0; i < data.length; i++) {
                fs.unlinkSync(`${process.env.VEHICLE_IMAGE_PATH}${data[i].photo}${process.env.IMAGE_URL}`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async insertNote(data) {

        const vehicleInsert = `insert into public.vehicle_notes(note, vehicle_id, user_id, type, step_status) values ($1, $2, $3, $4, $5);`;
        return await db.query(vehicleInsert, [data.note, data.vehicleId, data.userId, data.type, data.stepStatus]);
    }

    async updateNote(data) {

        const noteUpdate = `update public.vehicle_notes set note=$1 where id=$2 returning*`;
        return await db.query(noteUpdate, [data.note, data.id]);
    }

    async deleteNote(data) {

        const noteDelete = `delete from public.vehicle_notes where id=$1`;
        await db.query(noteDelete, [data.id]);
    }

    async selectVehicleNote(data) {

        const vehicleSelect = `select * from vehicle_notes where vehicle_id=$1 and ((id = $2) or ($2 = -1)) and ((step_status = $3) or ($3 = -1))`;
        return await db.query(vehicleSelect, [data.vehicleId, data.id || -1, data.stepStatus || -1]);
    }

    async insertVehicleProcess(data) {

        const vehicleProcessInsert = `insert into public.vehicle_process(vehicle_id, stock_id, status, note) values ($1, $2, $3, $4);`;
        return await db.query(vehicleProcessInsert, [data.vehicleId, data.stockId, data.status, data.note]);
    }

    async updateVehicleProcess(data) {

        const vehicleProcessUpdate = `update public.vehicle_process set status=$1, note=$2, updated_date=now() where id=$3 returning*`;
        return await db.query(vehicleProcessUpdate, [data.status, data.note, data.id]);
    }

    async deleteVehicleProcess(data) {

        const vehicleProcessDelete = `delete from public.vehicle_process where id=$1`;
        await db.query(vehicleProcessDelete, [data.id]);
    }

    async selectVehicleProcess(data) {

        const vehicleProcessSelect = `select * from vehicle_process where vehicle_id=$1 and ((id = $2) or ($2 = -1)) and ((status = $3) or ($3 = -1))`;
        return await db.query(vehicleProcessSelect, [data.vehicleId, data.id || -1, data.status || -1]);
    }

    async savePhotoInFolder(data) {

        const photoName = [];
        for (let i = 0; i < data.length; i++) {

            const pathName = await this.util.randomUuid();
            const pathToSaveImage = `${process.env.VEHICLE_IMAGE_PATH}${pathName}${process.env.IMAGE_URL}`;

            await converBase64ToImage(data[i], pathToSaveImage);
            photoName.push(pathName);
        }

        return photoName;
    }

    // #endregion Private methods
}

export default VehicleHandler;