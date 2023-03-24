import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import LoginModule from './modules/login.module';
import UserModule from './modules/user.module';
import VehicleModule from './modules/vehicle.module';
import AuthenticationModule from './modules/authentication.module';

@Module({
  imports: [AuthenticationModule,LoginModule,UserModule,VehicleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }