import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthenticationModule from './modules/authentication.module';
import LoginModule from './modules/login.module';
import UserModule from './modules/user.module';
import VehicleModule from './modules/vehicle.module';
import OperationModule from './modules/operation.module';
import OfferModule from './modules/offer.module';

@Module({
  imports: [AuthenticationModule,LoginModule,UserModule,VehicleModule,OperationModule,OfferModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }