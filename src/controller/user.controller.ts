import { Body, Controller, Post } from "@nestjs/common";
import UserService from "src/services/user.service";
import { Result } from "src/objects/Result";

import BaseResponseDto from "src/dto/base.response.dto";
import UserRequestDto from "src/dto/user/user.request.dto";
import SigninRequestDto from "src/dto/user/signin.request.dto";
import UpdateUserDto from "src/dto/user/update.user.dto";
import DeleteUserDto from "src/dto/user/delete.user.dto";

@Controller("user")
export default class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("signin")
    public async signin(@Body() reqDto: SigninRequestDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.userService.signin(reqDto);
        return result;
    }

    @Post("get")
    public async get(@Body() reqDto: UserRequestDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.userService.get(reqDto);
        return result;
    }

    @Post("update")
    public async update(@Body() reqDto: UpdateUserDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.userService.update(reqDto);
        return result;
    }

    @Post("delete")
    public async delete(@Body() reqDto: DeleteUserDto): Promise<Result<BaseResponseDto[]>> {
        const result = await this.userService.delete(reqDto);
        return result;
    }
}