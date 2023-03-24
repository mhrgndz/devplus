import { IsString, IsNumber } from "class-validator";

export default class VehicleResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    brand: string;

    @IsString()
    model: string;

    @IsNumber()
    stepStatus: string;

    @IsString()
    numberPlate: string;
}