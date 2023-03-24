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

        const operationResult = await this.selectVehicleOperation(vehicleId);

        if (!operationResult.rowCount) {
            return new ErrorResult(ErrorCodes.VEHICLE_NOT_FOUND);
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

    async insertVehicleOperation(vehicleId: number, operationId: number) {
        const query = `insert into public.vehicle_operation(vehicle_id, operation_id) values ($1, $2);`;
        return await this.dbService.query(query, [vehicleId, operationId]);
    }

    async selectVehicleOperation(vehicleId: number, operationId?: number, operationStatus?: number) {
        const query = `select * from vehicle_operation where vehicle_id=$1 and ((id = $2) or ($2 = -1)) and ((status = $3) or ($3 = -1))`;
        return await this.dbService.query(query, [vehicleId, operationId || -1, operationStatus || -1]);
    }

    // #endregion Private methods
}