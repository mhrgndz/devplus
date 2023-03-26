import { IsString, IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleNoteUpdateDto extends BaseRequestDto {
    @IsNumber()
    id: number;
    
    @IsNumber()
    vehicleId: number;

    @IsString()
    note: string;
}