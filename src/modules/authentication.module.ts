import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import AuthMiddleware from "src/middleware/authentication.middleware";
import DbService from "src/services/db.service";

@Module({ providers: [DbService] })
export default class AuthenticationModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes("*");
	}
}