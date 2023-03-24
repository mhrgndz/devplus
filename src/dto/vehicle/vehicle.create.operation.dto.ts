import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleOperationCreateDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;
    
    @IsNumber()
    operationId: number;
}