import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class OperationRequestDto extends BaseRequestDto {
    @IsNumber()
    id: number;
}