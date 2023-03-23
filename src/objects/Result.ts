export class Result<T>{
    public body: T;
    public success: boolean = true;
    public message: string = '';
    public statusCode: Number = 200;

    constructor(success: boolean, body: T, message: string) {
        this.body = body;
        this.message = message;
        this.success = success;
        this.statusCode = 200;
    }
}

export class SuccessResult extends Result<any> {
    constructor(body: any = { status: true }) {
        super(true, body, '');
    }
}

export class ErrorResult extends Result<any>{
    constructor(message: string) {
        super(false, {}, message);
    }
}