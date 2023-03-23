import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class DeleteUserDto extends BaseRequestDto {
    @IsNumber()
    userId: number;
}