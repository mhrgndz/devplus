import { Injectable } from "@nestjs/common";
import { Result, SuccessResult, ErrorResult } from "src/objects/Result";
import BaseService from "./base.service";
import ErrorCodes from "src/objects/ErrorCodes";

import BaseResponseDto from "src/dto/base.response.dto";
import SigninRequestDto from "src/dto/user/signin.request.dto";
import UserRequestDto from "src/dto/user/user.request.dto";
import UpdateUserDto from "src/dto/user/update.user.dto";
import DeleteUserDto from "src/dto/user/delete.user.dto";

@Injectable()
export default class UserService extends BaseService {
    public async signin(reqDto: SigninRequestDto): Promise<Result<BaseResponseDto[]>> {
        const { name, surname, email, mobilePhone, password } = reqDto;

        const user = await this.selectUser(mobilePhone);

        if (user.rowCount) {
            return new ErrorResult(ErrorCodes.PHONE_NUMBER_EXISTS);
        }

        const encrytedPassword = await this.encrypt(JSON.stringify(password), process.env.USER_PASSWORD_KEY);

        await this.insertUser(name, surname, email, mobilePhone, encrytedPassword);

        return new SuccessResult();
    }

    public async get(reqDto: UserRequestDto): Promise<Result<BaseResponseDto[]>> {
        const { userId } = reqDto;

        const user = await this.selectUser(null, userId);

        if (!user.rowCount) {
            return new ErrorResult(ErrorCodes.INVALID_USER);
        }

        const decrytedPassword = await this.decrypt(user.rows[0].password, process.env.USER_PASSWORD_KEY);

        user.rows[0]["userPassword"] = decrytedPassword

        return new SuccessResult(user.rows);
    }

    public async update(reqDto: UpdateUserDto): Promise<Result<BaseResponseDto[]>> {
        const { userId, name, surname, email, mobilePhone, isEnabled, password } = reqDto;

        const user = await this.selectUser(null, userId);

        if (!user.rowCount) {
            return new ErrorResult(ErrorCodes.INVALID_USER);
        }

        const encrytedPassword = await this.encrypt(JSON.stringify(password), process.env.USER_PASSWORD_KEY);

        await this.updateUser(userId, name, surname, email, mobilePhone, isEnabled , encrytedPassword);

        return new SuccessResult();
    }

    public async delete(reqDto: DeleteUserDto): Promise<Result<BaseResponseDto[]>> {
        const { userId } = reqDto;

        const user = await this.selectUser(null, userId);

        if (!user.rowCount) {
            return new ErrorResult(ErrorCodes.INVALID_USER);
        }
        
        await this.deleteUser(userId);

        return new SuccessResult();
    }

    // #region Private methods

    async selectUser(mobilePhone: string, userId?: number) {
        const result = await this.dbService.query(`select id,name,surname,email,mobile_phone as "mobilePhone",
            mobile_phone_country_code as "mobilePhoneCountryCode", is_enabled as "isEnabled", password, 
            role from users where (mobile_phone = $1) or ((id = $2) or ($2 = -1))`, [mobilePhone || null, userId || null]);

        return result;
    }

    async insertUser(name: string, surname: string, email: string, mobilePhone: string, encrytedPassword: string) {
        const query = `insert into public.users(name, surname, email, mobile_phone, password)
            VALUES ($1, $2, $3, $4, $5)`;

        await this.dbService.query(query, [name, surname, email, mobilePhone, encrytedPassword]);
    }

    async updateUser(userId: number, name: string, surname: string, email: string, mobilePhone: string, isEnabled: boolean, encrytedPassword: string) {
        const query = "update users set name=$2, surname=$3, email=$4, mobile_phone=$5, is_enabled=$6, password=$7 where id =$1";

        return await this.dbService.query(query, [userId, name, surname, email, mobilePhone, isEnabled, encrytedPassword]);
    }

    async deleteUser(userId: number) {
        const query = "delete from users where id =$1";

        return await this.dbService.query(query, [userId]);
    }

    // #endregion Private methods
}