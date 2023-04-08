import { Injectable } from "@nestjs/common";
import { Result, SuccessResult, ErrorResult } from "src/objects/Result";
import BaseService from "./base.service";
import ErrorCodes from "src/objects/ErrorCodes";
import { VehicleNoteType, VehicleOperationStatus } from "src/objects/Enums";

import BaseResponseDto from "src/dto/base.response.dto";
import VehicleCreateDto from "src/dto/vehicle/vehicle.create.dto";
import VehicleRequestDto from "src/dto/vehicle/vehicle.request.dto";
import VehicleResponseDto from "src/dto/vehicle/vehicle.response.dto";
import VehicleUpdateRequestDto from "src/dto/vehicle/vehicle.update.dto";
import VehicleDeleteDto from "src/dto/vehicle/vehicle.delete.dto";
import VehicleCreateOperationDto from "src/dto/vehicle/vehicle.create.operation.dto";
import VehicleOperationRequestDto from "src/dto/vehicle/vehicle.operation.dto";
import VehicleUpdateOperationDto from "src/dto/vehicle/vehicle.update.operation";
import VehicleDeleteOperationDto from "src/dto/vehicle/vehicle.delete.operation";
import VehicleOperationPhotoDto from "src/dto/vehicle/vehicle.operation.photo.dto";
import VehiclePhotoCreateDto from "src/dto/vehicle/vehicle.photo.create.dto";
import VehiclePhotoUpdateDto from "src/dto/vehicle/vehicle.photo.update.dto";
import VehiclePhotoDeleteDto from "src/dto/vehicle/vehicle.photo.delete.dto";
import VehicleNoteCreateDto from "src/dto/vehicle/vehicle.note.create.dto";
import VehicleNoteUpdateDto from "src/dto/vehicle/vehicle.note.update.dto";
import VehicleNoteRequestDto from "src/dto/vehicle/vehicle.note.dto";
import VehicleNoteDeleteDto from "src/dto/vehicle/vehicle.note.delete.dto";
import MyVehicleRequestDto from "src/dto/vehicle/my.vehicle.request.dto";

@Injectable()
export default class VehicleService extends BaseService {
    public async create(reqDto: VehicleCreateDto): Promise<Result<BaseResponseDto[]>> {
        const { userId, brand, model, numberPlate } = reqDto;

        const result = await this.insertVehicle(userId, brand, model, numberPlate);

        return new SuccessResult(result.rows);
    }

    public async get(reqDto: VehicleRequestDto): Promise<Result<VehicleResponseDto[]>> {
        const { userId, vehicleId } = reqDto;

        const vehicleResult = await this.selectVehicle(userId, vehicleId);

        return new SuccessResult(vehicleResult.rows);
    }

    public async update(reqDto: VehicleUpdateRequestDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, brand, model, numberPlate } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        await this.updateVehicle(vehicleId, brand, model, numberPlate);

        return new SuccessResult();
    }

    public async delete(reqDto: VehicleDeleteDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        await this.deleteVehicle(vehicleId);

        return new SuccessResult();
    }

    public async operationCreate(reqDto: VehicleCreateOperationDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, operationList } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const operationResult = await this.selectOperation(operationList);

        if (!operationResult.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_NOT_FOUND);
        }

        const vehicleOperationResult = await this.vehicleOperationControl(vehicleId, operationList);

        if (vehicleOperationResult.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_AVAIBLE);
        }

        await this.insertVehicleOperation(vehicleId, operationList);

        return new SuccessResult();
    }

    public async operationGet(reqDto: VehicleOperationRequestDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const resultOperation = await this.selectVehicleOperation(vehicleId);

        return new SuccessResult(resultOperation.rows);
    }

    public async operationUpdate(reqDto: VehicleUpdateOperationDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, operationId, status } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const vehicleOperationResult = await this.vehicleOperationControl(vehicleId, operationId);

        if (!vehicleOperationResult.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_NOT_FOUND);
        }

        await this.updateVehicleOperation(vehicleOperationResult.rows[0].id, status);

        return new SuccessResult();
    }

    public async operationDelete(reqDto: VehicleDeleteOperationDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, operationList } = reqDto;

        const vehicleResult = await this.selectVehicle(-1, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        await this.deleteVehicleOperation(vehicleId);

        return new SuccessResult();
    }

    public async operationPhotoCreate(reqDto: VehiclePhotoCreateDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, operationId, photoList } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const vehicleOperationResult = await this.vehicleOperationControl(vehicleId, operationId);

        if (!vehicleOperationResult.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_NOT_FOUND);
        }

        const operationPhoto = await this.selectOperationPhoto(vehicleId, -1, operationId);
        const vehicleImagePath = process.env.VEHICLE_IMAGE_PATH;
        const extension = process.env.IMAGE_EXTENSION;

        await this.deletePhotoInFolder(operationPhoto.rows, vehicleImagePath, extension);
        await this.deleteOperationPhotoDelete(vehicleId, -1, operationId); 

        const photoName = await this.savePhotoInFolder(photoList, process.env.VEHICLE_IMAGE_PATH, process.env.IMAGE_EXTENSION);
        const photoListValue = Array.from(photoList, (photo, index) => `('${photoName[index]}', ${index}, ${vehicleId}, ${operationId})`).join(", ");

        await this.insertOperationPhoto(photoListValue);

        return new SuccessResult();
    }

    public async operationPhotoGet(reqDto: VehicleOperationPhotoDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, operationId } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const selectPhotoResult = await this.selectOperationPhoto(vehicleId, -1, operationId);
        const response = await Promise.all(selectPhotoResult.rows.map(async (row) => {
            const photoPath = `${process.env.VEHICLE_IMAGE_PATH}${row.photo}${process.env.IMAGE_EXTENSION}`;
            const photoBuffer = await this.readFile(photoPath);
            const photoDataUrl = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;
          
            return {
                vehicleId: row.vehicle_id,
                id: row.id,
                sort: row.sort,
                operationId: row.operation_id,
                photo: photoDataUrl
            };
        }));

        return new SuccessResult(response);
    }

    public async operationPhotoUpdate(reqDto: VehiclePhotoUpdateDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, id, photoList } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const operationPhoto = await this.selectOperationPhoto(vehicleId, id, -1);

        if (!operationPhoto.rowCount) {
            return new ErrorResult(ErrorCodes.PHOTO_NOT_FOUND);
        }

        const vehicleImagePath = process.env.VEHICLE_IMAGE_PATH;
        const extension = process.env.IMAGE_EXTENSION;

        await this.deletePhotoInFolder(operationPhoto.rows, vehicleImagePath, extension);
        const photoUrl = await this.savePhotoInFolder(photoList, vehicleImagePath, extension);

        await this.updateOperationPhotoUpdate(id, photoUrl[0]);

        return new SuccessResult();
    }

    public async operationPhotoDelete(reqDto: VehiclePhotoDeleteDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, id } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const operationPhoto = await this.selectOperationPhoto(vehicleId, id, -1);

        if (!operationPhoto.rowCount) {
            return new ErrorResult(ErrorCodes.PHOTO_NOT_FOUND);
        }

        const vehicleImagePath = process.env.VEHICLE_IMAGE_PATH;
        const extension = process.env.IMAGE_EXTENSION;

        await this.deletePhotoInFolder(operationPhoto.rows, vehicleImagePath, extension);
        await this.deleteOperationPhotoDelete(vehicleId, id, -1); 

        return new SuccessResult();
    }

    public async noteCreate(reqDto: VehicleNoteCreateDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, userId, type, note } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        let noteType = VehicleNoteType.Customer;
        if (type === 1) {
            noteType = VehicleNoteType.Admin;
        }

        await this.insertNote(vehicleId, userId, noteType, note);

        return new SuccessResult();
    }

    public async noteUpdate(reqDto: VehicleNoteUpdateDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, id, note } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const noteResult = await this.selectVehicleNote(vehicleId, id);

        if (!noteResult.rowCount) {
            return new ErrorResult(ErrorCodes.NOTE_NOT_FOUND);
        }

        await this.updateNote(id, note);

        return new SuccessResult();
    }

    public async noteGet(reqDto: VehicleNoteRequestDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, type } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const noteResult = await this.selectVehicleNote(vehicleId, -1, type);

        return new SuccessResult(noteResult.rows);
    }

    public async noteDelete(reqDto: VehicleNoteDeleteDto): Promise<Result<BaseResponseDto[]>> {
        const { id, vehicleId } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const noteResult = await this.selectVehicleNote(vehicleId, id);

        if (!noteResult.rowCount) {
            return new ErrorResult(ErrorCodes.NOTE_NOT_FOUND);
        }

        await this.deleteNote(id);

        return new SuccessResult();
    }

    public async myVehicle(reqDto: MyVehicleRequestDto): Promise<Result<BaseResponseDto[]>> {
        const { userId } = reqDto;

        const vehicleResult = await this.selectMyVehicleOperation(userId);

        return new SuccessResult(vehicleResult.rows);
    }

    // #region Private methods

    async insertVehicle(userId: number, brand: string, model: string, numberPlate: string) {
        const query = `insert into public.vehicles(brand, model, user_id, number_plate) values ($1, $2, $3, $4) returning*`;
        return await this.dbService.query(query, [brand, model, userId, numberPlate.toUpperCase().replace(/\s/g, '')]);
    }

    async selectVehicle(userId: number, vehicleId?: number) {
        const query = `select vehicles.id as "vehicleId", brand, model, step_status as "stepStatus", user_id as "userId",
        number_plate as "numberPlate", users."name" || ' ' || users.surname as "userName",
        case when exists (select 1 from vehicle_operation vo where vo.vehicle_id = vehicles.id and vo.status <> 2) 
        then false else true end as "complateStatus"
        from vehicles inner join users on user_id = users.id
        where ((user_id = $1) or ($1 = -1)) or (vehicles.id = $2)`;
        return await this.dbService.query(query, [userId || null, vehicleId || null]);
    }
    
    async updateVehicle(vehicleId: number, brand: string, model: string, numberPlate: string) {
        const query = `update public.vehicles set brand=$2, model=$3, number_plate=$4, updated_date=now() where id=$1`;
        return await this.dbService.query(query, [vehicleId, brand, model, numberPlate.toUpperCase().replace(/\s/g, '')]);
    }

    async deleteVehicle(vehicleId: number) {
        const query = `delete from public.vehicles where id=$1`;
        await this.dbService.query(query, [vehicleId]);
    }

    async selectOperation(operationId: any) {
        const query = `select * from operations where id IN(${operationId})`;
        return await this.dbService.query(query);
    }

    async vehicleOperationControl(vehicleId: number, operationId: any) {
        const query = `select * from vehicle_operation where vehicle_id=$1 and operation_id IN(${operationId})`;
        return await this.dbService.query(query, [vehicleId]);
    }

    async insertVehicleOperation(vehicleId: number, operationList: number[]) {
        const values = operationList.map((operation: number) => `(${vehicleId}, '${operation}')`);
        const query = `insert into public.vehicle_operation(vehicle_id, operation_id) values ${values.join(",")}`;
        return await this.dbService.query(query);
    }

    async selectVehicleOperation(vehicleId: number, operationId?: number, operationStatus?: number) {
        const query = `select vo.id,vehicle_id as "vehicleId", operation_id as "operationId",
        status, name as "operationName" from vehicle_operation vo
        inner join operations o on vo.operation_id = o.id  where vehicle_id=$1 and ((vo.id = $2) or ($2 = -1)) and ((status = $3) or ($3 = -1))`;
        return await this.dbService.query(query, [vehicleId, operationId || -1, operationStatus || -1]);
    }

    async updateVehicleOperation(vehicleOperationId: number, status:number) {
        const query = `update public.vehicle_operation set status=$1, updated_date=now() where id=$2 `;
        return await this.dbService.query(query, [status, vehicleOperationId]);
    }

    async deleteVehicleOperation(vehicleId: any) {
        const query = `delete from public.vehicle_operation where vehicle_id=$1`;
        await this.dbService.query(query, [vehicleId]);
    }

    async selectOperationPhoto(vehicleId: number, id: number, operationId: number) {
        const query = `select * from vehicle_operation_photos where vehicle_id=$1 and ((id = $2) or ($2 = -1)) and ((operation_id = $3) or ($3 = -1)) order by sort`;
        return await this.dbService.query(query, [vehicleId || null, id || -1, operationId || -1]);
    }

    async deleteOperationPhotoDelete(vehicleId: number, id: number, operationId: number) {
        const query = `delete from public.vehicle_operation_photos where vehicle_id=$1 and ((id = $2) or ($2 = -1)) and ((operation_id = $3) or ($3 = -1))`;
        await this.dbService.query(query, [vehicleId, id || -1, operationId || -1]);
    }

    async insertOperationPhoto(valueList) {
		const query = `insert into vehicle_operation_photos (photo, sort, vehicle_id, operation_id) values ${valueList}`;
        return await this.dbService.query(query);
    }

    async updateOperationPhotoUpdate(id: number, photo: string) {
        const query = `update public.vehicle_operation_photos set photo=$2, updated_date=now() where id=$1`;
        return await this.dbService.query(query, [id, photo]);
    }

    async insertNote(vehicleId: number, userId: number, type: number, note: string) {
        const query = `insert into public.vehicle_notes(note, vehicle_id, user_id, type) values ($1, $2, $3, $4);`;
        return await this.dbService.query(query, [note, vehicleId, userId, type]);
    }

    async selectVehicleNote(vehicleId: number, noteId?: number, type?:number) {
        const query = `select v1.id,v1.vehicle_id as "vehicleId", v1.type, v1.user_id as "userId" ,
        (select string_agg(note, ' | ') AS notes from vehicle_notes vn2 where vn2.vehicle_id = v1.vehicle_id and ((type = $3) or ($3 = -1))) as note
        from vehicle_notes v1 where vehicle_id=$1 and ((id = $2) or ($2 = -1)) limit 1`;
        return await this.dbService.query(query, [vehicleId, noteId || -1, type]);
    }

    async updateNote(id: number, note: string) {
        const noteUpdate = `update public.vehicle_notes set note=$1 where id=$2`;
        return await this.dbService.query(noteUpdate, [note, id]);
    }

    async deleteNote(id: number) {
        const query = `delete from public.vehicle_notes where id=$1`;
        await this.dbService.query(query, [id]);
    }

    async selectMyVehicleOperation(userId: number) {
        const query = `select vo.id,vehicle_id as "vehicleId", operation_id as "operationId",status, 
        name as "operationName",v.brand, v.model, v.number_plate as "numberPlate", v.user_id as "userId"
        from vehicle_operation vo
        inner join operations o on vo.operation_id = o.id  
        inner join vehicles v on v.id = vo.vehicle_id  
        where v.user_id = $1 order by vo.status desc`;
        return await this.dbService.query(query, [userId]);
    }

    // #endregion Private methods
}