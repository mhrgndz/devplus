import { Module } from "@nestjs/common"
import OperationService from "src/services/operation.service"
import OperationController from "src/controller/operation.controller"
import DbService from "src/services/db.service"

@Module({
	controllers: [OperationController],
	providers: [OperationService, DbService],
})
export default class OperationModule { }