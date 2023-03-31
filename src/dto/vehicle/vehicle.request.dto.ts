import { IsNumber, IsOptional } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleRequestDto extends BaseRequestDto {
    @IsOptional()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsNumber()
    vehicleId: number;
}