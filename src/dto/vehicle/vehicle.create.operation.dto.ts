import { IsNumber, IsArray } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleOperationCreateDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;
    
    @IsArray()
    operationList: number[];
}