import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class OfferRequestDto extends BaseRequestDto {
    @IsNumber()
    offerId: number;
}