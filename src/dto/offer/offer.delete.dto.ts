import { IsNumber } from "class-validator";
import BaseRequestDto from "../base.request.dto";

export default class OfferDeleteDto extends BaseRequestDto {
    @IsNumber()
    offerId: number;
}