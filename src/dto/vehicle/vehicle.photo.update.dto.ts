import { IsString, IsNumber, IsArray } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehiclePhotoUpdateDto extends BaseRequestDto {
    @IsNumber()
    id: number;
    
    @IsNumber()
    vehicleId: number;

    @IsArray()
    photoList: string[];
}