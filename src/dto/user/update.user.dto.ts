import { IsNumber, IsString, IsBoolean } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class UpdateUserDto extends BaseRequestDto {
    @IsNumber()
    userId: number;

    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsString()
    email: string;

    @IsString()
    mobilePhone: string;

    @IsBoolean()
    isEnabled: boolean;

    @IsString()
    password: string;
}