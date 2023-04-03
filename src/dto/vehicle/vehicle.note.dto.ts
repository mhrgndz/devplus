import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleNoteRequestDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;

    @IsNumber()
    type: number;
}