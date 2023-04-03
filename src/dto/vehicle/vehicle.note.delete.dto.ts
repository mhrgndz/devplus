import { IsNumber, IsOptional } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleNoteDeleteDto extends BaseRequestDto {
    @IsOptional()
    @IsNumber()
    id: number;
    
    @IsNumber()
    vehicleId: number;
}