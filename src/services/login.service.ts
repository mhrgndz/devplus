import { Injectable } from "@nestjs/common";
import { Result, SuccessResult, ErrorResult } from "src/objects/Result";
import BaseService from "./base.service";
import ErrorCodes from "src/objects/ErrorCodes";

import LoginRequestDto from "src/dto/login/login.request.dto";
import LoginResponseDto from "src/dto/login/login.response.dto";
import VerifyTokenRequestDto from "src/dto/login/verify.token.request.dto";
import VerifyTokenResponseDto from "src/dto/login/verify.token.response.dto";

@Injectable()
export default class LoginService extends BaseService {
    public async login(reqDto: LoginRequestDto): Promise<Result<LoginResponseDto[]>> {
        const { mobilePhone, password } = reqDto;

        const user = await this.selectUser(mobilePhone);

        if (!user.rowCount) {
            return new ErrorResult(ErrorCodes.INVALID_USER);
        }

        const decryptPassword = await this.decrypt(user.rows[0].password, process.env.USER_PASSWORD_KEY);

        if (decryptPassword !== password) {
            return new ErrorResult(ErrorCodes.INVALID_PASSWORD);
        }

        const token = await this.randomUuid();

        await this.updateUser(token, user.rows[0].id);

        return new SuccessResult({ accessToken: token });
    }

    async verifyToken(reqDto: VerifyTokenRequestDto): Promise<Result<VerifyTokenResponseDto[]>> {
        const { accessToken } = reqDto;

        const tokenResult = await this.dbService.query("select id from users where is_enabled = true and access_token=$1", [accessToken]);

        if (!tokenResult.rowCount) {
            return new ErrorResult(ErrorCodes.INVALID_TOKEN);
        }

        return new SuccessResult({ isAuth:true, role: tokenResult.rows[0].role });
    }

    // #region Private methods

    async selectUser(mobilePhone:string) {
        const result = await this.dbService.query("select * from users where is_enabled=true and mobile_phone=$1", [mobilePhone]);

        return result;
    }

    async updateUser(accessToken:string, userId:number) {
        await this.dbService.query("update users set access_token=$1 where id=$2", [accessToken, userId]);
    }

    // #endregion Private methods
}