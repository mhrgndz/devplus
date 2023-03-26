import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleNoteDeleteDto extends BaseRequestDto {
    @IsNumber()
    id: number;
    
    @IsNumber()
    vehicleId: number;
}