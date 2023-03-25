import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehiclePhotoDeleteDto extends BaseRequestDto {
    @IsNumber()
    vehicleId: number;

    @IsNumber()
    id: number;
}