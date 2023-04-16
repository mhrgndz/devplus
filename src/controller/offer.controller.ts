import { Body, Controller, Post } from "@nestjs/common";
import OfferService from "src/services/offer.service";
import { Result } from "src/objects/Result";
import Validator from "../decorators/validation.decorator";

import BaseResponseDto from "src/dto/base.response.dto";
import OfferCreateDto from "src/dto/offer/offer.create.dto";
import OfferDeleteDto from "src/dto/offer/offer.delete.dto";
import OfferRequestDto from "src/dto/offer/offer.request";

@Controller("offer")
export default class OfferController {
    constructor(private readonly offerService: OfferService) {}

    @Post("create")
    @Validator(OfferCreateDto)
    public async create(@Body() reqDto: OfferCreateDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.offerService.create(reqDto);
        return result;
    }

    @Post("delete")
    @Validator(OfferDeleteDto)
    public async delete(@Body() reqDto: OfferDeleteDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.offerService.delete(reqDto);
        return result;
    }

    @Post("get")
    @Validator(OfferRequestDto)
    public async get(@Body() reqDto: OfferRequestDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.offerService.get(reqDto);
        return result;
    }

    @Post("getDetail")
    @Validator(OfferRequestDto)
    public async getDetail(@Body() reqDto: OfferRequestDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.offerService.getDetail(reqDto);
        return result;
    }
}