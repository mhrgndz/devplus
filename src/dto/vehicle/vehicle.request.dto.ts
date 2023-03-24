import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleRequestDto extends BaseRequestDto {
    @IsNumber()
    userId: number;
}