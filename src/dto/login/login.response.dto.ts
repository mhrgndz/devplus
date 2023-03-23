import { IsString } from "class-validator";

export default class LoginResponseDto {
    @IsString()
    accessToken: string;
}