import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleOperationRequestDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;
}