import { validateOrReject } from "class-validator";
import { plainToClass } from "class-transformer";
import ErrorCodes from "../objects/ErrorCodes";
import ApplicationError from "../objects/ApplicationError";

export default function Validator(type: any) {
    return function decorator(target: any, key: string | symbol, descriptor: PropertyDescriptor) {
        const orig = descriptor.value;

        descriptor.value = async function validate(...args: any[]): Promise<any> {
            const dto = plainToClass(type, args[0]);

            await validateOrReject(dto).catch((errors) => {
                if (errors.message) {
                    throw new Error(errors.message);
                }
                throw new ApplicationError(ErrorCodes.MISSING_PARAMETERS, errors);
            });

            return orig.apply(this, args);
        };
        
        return descriptor;
    };
}
