import { IsString } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class SigninRequestDto extends BaseRequestDto {
    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsString()
    email: string;

    @IsString()
    mobilePhone: string;

    @IsString()
    password: string;
}