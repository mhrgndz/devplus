import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleDeleteOperationDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;

    @IsNumber()
    operationId: number;
}