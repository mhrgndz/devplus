import { IsString, IsNumber, MaxLength } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VehicleCreateDto extends BaseRequestDto {
    @IsNumber()
    userId: number;
    
    @IsString()
    brand: string;

    @IsString()
    model: string;

    @IsString()
    @MaxLength(10)
    numberPlate: string;
}