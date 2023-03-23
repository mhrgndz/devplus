import { IsString,IsNumber } from "class-validator";

export default class BaseRequestDto {
    @IsNumber()
    timezone: number = 0;

    @IsString()
    requestId: string = "";
}