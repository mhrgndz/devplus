import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import LoginService from "src/services/login.service";
import Validator from "../decorators/validation.decorator";
import { Result } from "src/objects/Result";

import LoginRequestDto from "src/dto/login/login.request.dto";
import LoginResponseDto from "src/dto/login/login.response.dto";
import VerifyTokenResponseDto from "src/dto/login/verify.token.response.dto";
import VerifyTokenRequestDto from "src/dto/login/verify.token.request.dto";

@Controller("login")
export default class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Post("login")
    @Validator(LoginRequestDto)
	public async login(@Body() reqDto: LoginRequestDto): Promise<Result<LoginResponseDto[]>> {
        const result = await this.loginService.login(reqDto);
        return result;
	}

    @Post("verifyToken")
    @Validator(VerifyTokenRequestDto)
	public async verifyToken(@Body() reqDto: VerifyTokenRequestDto): Promise<Result<VerifyTokenResponseDto[]>> {
        const result = await this.loginService.verifyToken(reqDto);
        return result;
	}
} 