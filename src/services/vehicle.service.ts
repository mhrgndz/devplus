import { Injectable } from "@nestjs/common";
import { Result, SuccessResult, ErrorResult } from "src/objects/Result";
import BaseService from "./base.service";
import ErrorCodes from "src/objects/ErrorCodes";

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
import VehiclePhotoCreateDto from "src/dto/vehicle/vehicle.photo.create.dto";

@Injectable()
export default class VehicleService extends BaseService {
    public async create(reqDto: VehicleCreateDto): Promise<Result<BaseResponseDto[]>> {
        const { userId, brand, model, numberPlate } = reqDto;

        await this.insertVehicle(userId, brand, model, numberPlate);

        return new SuccessResult();
    }

    public async get(reqDto: VehicleRequestDto): Promise<Result<VehicleResponseDto[]>> {
        const { userId } = reqDto;

        const vehicleResult = await this.selectVehicle(userId);

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
        const { vehicleId, operationId } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const operationResult = await this.selectOperation(operationId);

        if (!operationResult.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_NOT_FOUND);
        }

        const vehicleOperationResult = await this.vehicleOperationControl(vehicleId, operationId);

        if (vehicleOperationResult.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_AVAIBLE);
        }

        await this.insertVehicleOperation(vehicleId, operationId);

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
        const { vehicleId, operationId } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const vehicleOperationResult = await this.vehicleOperationControl(vehicleId, operationId);

        if (!vehicleOperationResult.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_NOT_FOUND);
        }

        await this.deleteVehicleOperation(vehicleOperationResult.rows[0].id);

        return new SuccessResult();
    }

    public async operationPhotoCreate(reqDto: VehiclePhotoCreateDto): Promise<Result<BaseResponseDto[]>> {
        const { vehicleId, operationId, photoList } = reqDto;

        const vehicleResult = await this.selectVehicle(null, vehicleId);

        if (!vehicleResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
        }

        const selectVehicleResult = await this.selectOperationPhoto(vehicleId, -1, -1);
        const vehicleImagePath = process.env.VEHICLE_IMAGE_PATH;
        const extension = process.env.IMAGE_EXTENSION;

        await this.deletePhotoInFolder(selectVehicleResult.rows, vehicleImagePath, extension);
        await this.deleteOperationPhotoDelete(vehicleId, -1); 

        const photoName = await this.savePhotoInFolder(photoList, process.env.VEHICLE_IMAGE_PATH, process.env.IMAGE_EXTENSION);

        const photoListValue = Array.from(photoList, (photo, index) => `('${photoName[index]}', ${index}, ${vehicleId}, ${operationId})`).join(", ");

        await this.insertOperationPhoto(photoListValue);

        return new SuccessResult();
    }

    // #region Private methods

    async insertVehicle(userId: number, brand: string, model: string, numberPlate: string) {
        const query = `insert into public.vehicles(brand, model, user_id, number_plate) values ($1, $2, $3, $4)`;
        return await this.dbService.query(query, [brand, model, userId, numberPlate.toUpperCase().replace(/\s/g, '')]);
    }

    async selectVehicle(userId: number, vehicleId?: number) {
        const query = `select id, brand, model, step_status as "stepStatus", user_id as "userId",
                                number_plate as "numberPlate" from vehicles where ((user_id = $1) or ($1 = -1)) or (id = $2)`;
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

    async selectOperation(operationId: number) {
        const query = `select * from operations where id=$1`;
        return await this.dbService.query(query, [operationId]);
    }

    async vehicleOperationControl(vehicleId: number, operationId: number) {
        const query = `select * from vehicle_operation where vehicle_id=$1 and operation_id=$2`;
        return await this.dbService.query(query, [vehicleId, operationId]);
    }

    async insertVehicleOperation(vehicleId: number, operationId: number) {
        const query = `insert into public.vehicle_operation(vehicle_id, operation_id) values ($1, $2);`;
        return await this.dbService.query(query, [vehicleId, operationId]);
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

    async deleteVehicleOperation(id: number) {

        const query = `delete from public.vehicle_operation where id=$1`;
        await this.dbService.query(query, [id]);
    }

    async selectOperationPhoto(vehicleId: number, id: number, operationId: number) {
        const query = `select * from vehicle_operation_photos where vehicle_id=$1 and ((id = $2) or ($2 = -1)) and ((operation_id = $3) or ($3 = -1)) order by sort`;
        return await this.dbService.query(query, [vehicleId || null, id || -1, operationId || -1]);
    }

    async deleteOperationPhotoDelete(vehicleId: number, id: number) {
        const query = `delete from public.vehicle_operation_photos where vehicle_id=$1 and ((id = $2) or ($2 = -1))`;
        await this.dbService.query(query, [vehicleId, id || -1]);
    }

    async insertOperationPhoto(valueList) {
		const query = `insert into vehicle_operation_photos (photo, sort, vehicle_id, operation_id) values ${valueList}`;
        return await this.dbService.query(query);
    }

    // #endregion Private methods
}