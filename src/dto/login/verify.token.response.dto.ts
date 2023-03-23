import { IsString, IsBoolean } from "class-validator";
import BaseResponseDto from "../base.response.dto";

export default class VerifyTokenResponseDto extends BaseResponseDto {
    @IsBoolean()
    isAuth: boolean;

    @IsString()
    role: string;
}