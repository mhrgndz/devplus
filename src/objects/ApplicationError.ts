class ApplicationError extends Error {
    data: any;

    constructor(msg: string, data?: any) {
        super(msg);

        this.data = data;
    }
}

export default ApplicationError;
