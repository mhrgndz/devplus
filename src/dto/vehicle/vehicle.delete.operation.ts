import { IsNumber, IsArray, IsOptional } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleDeleteOperationDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;

    @IsOptional()
    @IsArray()
    operationList: number[];
}