import { Body, Controller, Post } from "@nestjs/common";
import Validator from "../decorators/validation.decorator";
import VehicleService from "src/services/vehicle.service";
import { Result } from "src/objects/Result";

import BaseResponseDto from "src/dto/base.response.dto";
import VehicleRequestDto from "src/dto/vehicle/vehicle.request.dto";
import VehicleResponseDto from "src/dto/vehicle/vehicle.response.dto";
import VehicleCreateDto from "src/dto/vehicle/vehicle.create.dto";
import VehicleUpdateDto from "src/dto/vehicle/vehicle.update.dto";
import VehicleDeleteDto from "src/dto/vehicle/vehicle.delete.dto";
import VehicleOperationDto from "src/dto/vehicle/vehicle.create.operation.dto";
import VehicleOperationRequestDto from "src/dto/vehicle/vehicle.operation.dto";
import VehicleUpdateOperationDto from "src/dto/vehicle/vehicle.update.operation";
import VehicleDeleteOperationDto from "src/dto/vehicle/vehicle.delete.operation";
import VehicleOperationPhotoDto from "src/dto/vehicle/vehicle.operation.photo.dto";
import VehiclePhotoCreateDto from "src/dto/vehicle/vehicle.photo.create.dto";
import VehiclePhotoUpdateDto from "src/dto/vehicle/vehicle.photo.update.dto";
import VehiclePhotoDeleteDto from "src/dto/vehicle/vehicle.photo.delete.dto";

@Controller("vehicle")
export default class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}

    @Post("create")
    @Validator(VehicleCreateDto)
    public async create(@Body() reqDto: VehicleCreateDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.create(reqDto);
        return result;
    }

    @Post("get")
    @Validator(VehicleRequestDto)
    public async get(@Body() reqDto: VehicleRequestDto): Promise<Result<VehicleResponseDto[]>> {
        const result = await this.vehicleService.get(reqDto);
        return result;
    }

    @Post("update")
    @Validator(VehicleUpdateDto)
    public async update(@Body() reqDto: VehicleUpdateDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.update(reqDto);
        return result;
    }

    @Post("delete")
    @Validator(VehicleDeleteDto)
    public async delete(@Body() reqDto: VehicleDeleteDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.delete(reqDto);
        return result;
    }

    @Post("operationCreate")
    @Validator(VehicleOperationDto)
    public async operationCreate(@Body() reqDto: VehicleOperationDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.operationCreate(reqDto);
        return result;
    }

    @Post("operationGet")
    @Validator(VehicleOperationRequestDto)
    public async operationGet(@Body() reqDto: VehicleOperationRequestDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.operationGet(reqDto);
        return result;
    }

    @Post("operationUpdate")
    @Validator(VehicleUpdateOperationDto)
    public async operationUpdate(@Body() reqDto: VehicleUpdateOperationDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.operationUpdate(reqDto);
        return result;
    }

    @Post("operationDelete")
    @Validator(VehicleDeleteOperationDto)
    public async operationDelete(@Body() reqDto: VehicleDeleteOperationDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.operationDelete(reqDto);
        return result;
    }

    @Post("operationPhotoCreate")
    @Validator(VehiclePhotoCreateDto)
    public async operationPhotoCreate(@Body() reqDto: VehiclePhotoCreateDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.operationPhotoCreate(reqDto);
        return result;
    }

    @Post("operationPhotoGet")
    @Validator(VehicleOperationPhotoDto)
    public async operationPhotoGet(@Body() reqDto: VehicleOperationPhotoDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.operationPhotoGet(reqDto);
        return result;
    }

    @Post("operationPhotoUpdate")
    @Validator(VehiclePhotoUpdateDto)
    public async operationPhotoUpdate(@Body() reqDto: VehiclePhotoUpdateDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.operationPhotoUpdate(reqDto);
        return result;
    }

    @Post("operationPhotoDelete")
    @Validator(VehiclePhotoDeleteDto)
    public async operationPhotoDelete(@Body() reqDto: VehiclePhotoDeleteDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.vehicleService.operationPhotoDelete(reqDto);
        return result;
    }
}