import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleDeleteDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;
}