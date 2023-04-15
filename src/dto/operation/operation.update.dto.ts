import { IsNumber, IsString } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class OperationUpdateDto extends BaseRequestDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsNumber()
    price: number;
}