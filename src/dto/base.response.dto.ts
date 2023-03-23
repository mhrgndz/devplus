import { IsBoolean } from "class-validator";

export default class BaseResponseDto {
    @IsBoolean()
    status: boolean;

    constructor(status: boolean = true) {
        this.status = status;
    }
}