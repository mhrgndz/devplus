import { IsString, IsNumber, MaxLength } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class MyVehicleRequestDto extends BaseRequestDto {
    @IsNumber()
    userId: number;
}