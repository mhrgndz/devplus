import { IsString, IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleNoteCreateDto extends BaseRequestDto {
    @IsNumber()
    userId: number;
    
    @IsNumber()
    vehicleId: number;

    @IsNumber()
    type: number;

    @IsString()
    note: string;
}