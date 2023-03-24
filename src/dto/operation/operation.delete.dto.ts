import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class OperationDeleteDto extends BaseRequestDto {
    @IsNumber()
    id: number;
}