import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleOperationPhotoDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;
    
    @IsNumber()
    operationId: number;
}