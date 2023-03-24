import { IsString, IsNumber, IsArray } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehiclePhotoCreateDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;
    
    @IsNumber()
    operationId: number;

    @IsArray()
    photoList: string[];
}