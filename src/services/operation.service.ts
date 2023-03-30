import { Injectable } from "@nestjs/common";
import { Result, SuccessResult, ErrorResult } from "src/objects/Result";
import BaseService from "./base.service";
import ErrorCodes from "src/objects/ErrorCodes";

import BaseResponseDto from "src/dto/base.response.dto";
import OperationCreateDto from "src/dto/operation/operation.create.dto";
import OperationUpdateDto from "src/dto/operation/operation.update.dto";
import OperationRequestDto from "src/dto/operation/operation.request.dto";
import OperationDeleteDto from "src/dto/operation/operation.delete.dto";

@Injectable()
export default class OperationService extends BaseService {
    public async create(reqDto: OperationCreateDto): Promise<Result<BaseResponseDto[]>> {
        const { name } = reqDto;

        await this.insertOperation(name);

        return new SuccessResult();
    }

    public async get(reqDto: OperationRequestDto): Promise<Result<BaseResponseDto[]>> {
        const { id } = reqDto;

        const resultOperation = await this.selectOperation(id);

        if (!resultOperation.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_NOT_FOUND);
        }

        return new SuccessResult(resultOperation.rows);
    }

    public async update(reqDto: OperationUpdateDto): Promise<Result<BaseResponseDto[]>> {
        const { id, name } = reqDto;    

        const resultOperation = await this.selectOperation(id);

        if (!resultOperation.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_NOT_FOUND);
        }

        await this.updateOperation(id, name);

        return new SuccessResult();
    }

    public async delete(reqDto: OperationDeleteDto): Promise<Result<BaseResponseDto[]>> {
        const { id } = reqDto;    

        const resultOperation = await this.selectOperation(id);

        if (!resultOperation.rowCount) {
            return new ErrorResult(ErrorCodes.OPERATION_NOT_FOUND);
        }

        await this.deleteOperation(id);

        return new SuccessResult();
    }

    // #region Private methods

    async insertOperation(name: string) {
        const query = `insert into public.operations(name) values ($1)`;
        return await this.dbService.query(query, [name]);
    }

    async selectOperation(id: number) {
        const query = "select id,name from operations where ((id = $1) or ($1 = -1)) order by id desc";
        return await this.dbService.query(query, [id || -1]);
    }

    async updateOperation(id: number, name: string) {
        const query = `update operations set name=$2 where id=$1`;
        return await this.dbService.query(query, [id, name]);
    }

    async deleteOperation(id: number) {
        const query = "delete from operations where id=$1";
        return await this.dbService.query(query, [id]);
    }

    // #endregion Private methods
}