import { Module } from "@nestjs/common"
import OfferController from "src/controller/offer.controller"
import OfferService from "src/services/offer.service"
import DbService from "src/services/db.service"

@Module({
	controllers: [OfferController],
	providers: [OfferService, DbService],
})
export default class OfferModule { }