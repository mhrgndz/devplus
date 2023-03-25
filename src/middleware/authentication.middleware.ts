import { NestMiddleware, Injectable } from "@nestjs/common";
import ErrorCodes from "src/objects/ErrorCodes";
import DbService from "src/services/db.service";
import pathObject from "src/objects/PathObject";
import { Result } from "src/objects/Result";

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
    PathObject: string[];

    constructor(private readonly dbService: DbService) {
        this.PathObject = pathObject;
    }

    async use(req: any, res: any, next: (error?: any)  => void) {
        const accessToken = req.headers["accesstoken"];
        const verifyPathResult = await this.verifyPathObject(req.originalUrl);

        if (verifyPathResult) {
            next();
            return;
        }

        if (accessToken) {
            const tokenResult = await this.verifyToken(accessToken);
    
            if(!tokenResult) {
                res.send(new Result(false, {}, ErrorCodes.INVALID_TOKEN));
                return;
            }

            next();
        } else {
            res.send(new Result(false, {}, ErrorCodes.AUTHORIZATION_ERROR));
        }
    }

    async verifyPathObject(requestPath: string) {
        const findPath = requestPath.split("/").filter(item => {return item !== ""});
        const pathResult = this.PathObject.find(path => path === findPath[1]);

        return pathResult;
    }

    async verifyToken(accessToken: string) {
        const tokenResult = await this.dbService.query("select id from users where access_token=$1", [accessToken]);

        if(tokenResult.rowCount) {
            return true;
        }
        
        return false;
    }
}