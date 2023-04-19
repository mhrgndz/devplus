import { Injectable } from "@nestjs/common";
import { Result, SuccessResult, ErrorResult } from "src/objects/Result";
import BaseService from "./base.service";
import ErrorCodes from "src/objects/ErrorCodes";

import BaseResponseDto from "src/dto/base.response.dto";
import OfferCreateDto from "src/dto/offer/offer.create.dto";
import OfferDeleteDto from "src/dto/offer/offer.delete.dto";
import OfferRequestDto from "src/dto/offer/offer.request";

@Injectable()
export default class OfferService extends BaseService {
    public async create(reqDto: OfferCreateDto): Promise<Result<BaseResponseDto[]>> {
        const { userId, detailList } = reqDto;

        const totalPrice = detailList.reduce((total, item) => { return total + item.price}, 0);
        const masterResult = await this.insertOfferMaster(userId, totalPrice);
        await this.insertOfferDetail(masterResult, detailList);

        return new SuccessResult();
    }

    public async delete(reqDto: OfferDeleteDto) {
        const { offerId } = reqDto;

        const masterResult = await this.selectOfferMaster(offerId);

        if (!masterResult) {
            return new ErrorResult(ErrorCodes.OFFER_NOT_FOUND);
        }

        await this.deleteOfferDetail(offerId);
        await this.deleteOfferMaster(offerId);

        return new SuccessResult();
    }

    public async get(reqDto: OfferRequestDto) {
        const { offerId } = reqDto;

        const masterResult = await this.selectOfferMaster(offerId);

        if (!masterResult) {
            return new ErrorResult(ErrorCodes.OFFER_NOT_FOUND);
        }

        return new SuccessResult(masterResult);
    }

    public async getDetail(reqDto: OfferRequestDto) {
        const { offerId } = reqDto;

        const masterResult = await this.selectOfferMaster(offerId);

        if (!masterResult) {
            return new ErrorResult(ErrorCodes.OFFER_NOT_FOUND);
        }

        const detailResult = await this.selectOfferDetail(offerId);

        return new SuccessResult(detailResult);
    }

    // #region Private methods

    async insertOfferMaster(userId: number, amount: number) {
        const query = `insert into public.offers_master (user_id, amount) values($1, $2) returning id`;
        const result = await this.dbService.query(query, [userId, amount]);
 
        return result.rows[0].id;
    }

    async insertOfferDetail(masterId: number, detailList: any) {
        const values = detailList.reduce((insertList: string[], data) => { insertList.push(`(${masterId}, '${data.operationId}', '${data.price}')`); return insertList}, []);
        const query = `insert into public.offers_detail(master_id, operation_id, price) values ${values.join(",")}`;
        await this.dbService.query(query);

        return;
    }

    async deleteOfferMaster(masterId: number) {
        const query = "delete from offers_master where id=$1";
        await this.dbService.query(query, [masterId]);
    }

    async deleteOfferDetail(masterId: number) {
        const query = "delete from offers_detail where master_id=$1";
        await this.dbService.query(query, [masterId]);
    }

    async selectOfferMaster(masterId: number) {
        const result = await this.dbService.query(`select om.id, u.name, u.surname, u.email, om.amount from offers_master om
        join users u on u.id = om.user_id where ((om.id = $1) or ($1 = -1))`, [masterId]);

        return result.rowCount > 0 ? result.rows : false;
    }

    async selectOfferDetail(masterId: number) {
        const result = await this.dbService.query(`select o.name, od.price from offers_detail od 
        join operations o on od.operation_id = o.id where master_id=$1`, [masterId]);

        return result.rowCount > 0 ? result.rows : false;
    }

    // #endregion Private methods
}