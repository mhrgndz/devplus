import { Module } from "@nestjs/common"
import LoginController from "src/controller/login.controller"
import LoginService from "src/services/login.service"
import DbService from "src/services/db.service"

@Module({
	controllers: [LoginController],
	providers: [LoginService, DbService],
})
export default class LoginModule { }