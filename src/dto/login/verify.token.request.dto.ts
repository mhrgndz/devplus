import { IsString } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class VerifyTokenRequestDto extends BaseRequestDto {
    @IsString()
    accessToken: string;
}