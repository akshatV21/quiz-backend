import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as morgran from 'morgan'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService)

  const PORT = configService.get('PORT')

  app.use(helmet())
  app.use(morgran('dev'))

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(PORT, () => console.log(`Listening to requests on port: ${PORT}`))
}
bootstrap();
