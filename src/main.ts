import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from "body-parser";
import * as dotenv from "dotenv";

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ limit: "50mb", extended: true }));

  await app.init();
  app.enableCors();

  await app.listen(process.env.SERVER_PORT, "0.0.0.0");
}

bootstrap().then(() => {
  console.log(`DevPlus Server is running on port: ${process.env.SERVER_PORT} `);
}).catch((err) => console.log(err));