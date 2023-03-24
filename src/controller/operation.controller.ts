import { Body, Controller, Post } from "@nestjs/common";
import OperationService from "src/services/operation.service";
import Validator from "../decorators/validation.decorator";
import { Result } from "src/objects/Result";

import BaseResponseDto from "src/dto/base.response.dto";
import OperationCreateDto from "src/dto/operation/operation.create.dto";
import OperationRequestDto from "src/dto/operation/operation.request.dto";
import OperationUpdateDto from "src/dto/operation/operation.update.dto";
import OperationDeleteDto from "src/dto/operation/operation.delete.dto";

@Controller("operation")
export default class OperationController {
    constructor(private readonly operationService: OperationService) {}

    @Post("create")
    @Validator(OperationCreateDto)
    public async create(@Body() reqDto: OperationCreateDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.operationService.create(reqDto);
        return result;
    }

    @Post("get")
    @Validator(OperationRequestDto)
    public async get(@Body() reqDto: OperationRequestDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.operationService.get(reqDto);
        return result;
    }

    @Post("update")
    @Validator(OperationUpdateDto)
    public async update(@Body() reqDto: OperationUpdateDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.operationService.update(reqDto);
        return result;
    }

    @Post("delete")
    @Validator(OperationDeleteDto)
    public async delete(@Body() reqDto: OperationDeleteDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.operationService.delete(reqDto);
        return result;
    }
}