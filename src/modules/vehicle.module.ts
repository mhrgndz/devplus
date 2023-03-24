import { Module } from "@nestjs/common"
import VehicleService from "src/services/vehicle.service"
import VehicleController from "src/controller/vehicle.controller"
import DbService from "src/services/db.service"

@Module({
	controllers: [VehicleController],
	providers: [VehicleService, DbService],
})
export default class VehicleModule { }