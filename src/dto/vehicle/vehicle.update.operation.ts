import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleUpdateOperationDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;

    @IsNumber()
    operationId: number;

    @IsNumber()
    status: number;
}