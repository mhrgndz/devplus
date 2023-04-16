import { IsString, IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class OperationCreateDto extends BaseRequestDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;
}