import { IsString } from "class-validator";

export default class LoginRequestDto {
    @IsString()
    mobilePhone: string;

    @IsString()
    password: string;
}