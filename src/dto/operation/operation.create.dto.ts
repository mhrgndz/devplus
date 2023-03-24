import { IsString } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class OperationCreateDto extends BaseRequestDto {
    @IsString()
    name: string;
}