import { IsNumber, IsArray, ArrayMinSize } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class OfferCreateDto extends BaseRequestDto {
    @ArrayMinSize(1)
    @IsArray()
    detailList: Array<{ operationId: number, price: number }>;

    @IsNumber()
    userId: number;
}