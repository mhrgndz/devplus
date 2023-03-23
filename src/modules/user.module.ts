import { Module } from "@nestjs/common"
import UserService from "src/services/user.service"
import UserController from "src/controller/user.controller"
import DbService from "src/services/db.service"

@Module({
	controllers: [UserController],
	providers: [UserService, DbService],
})
export default class UserModule { }