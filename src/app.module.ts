import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { SetsModule } from './sets/sets.module';
import { PracticeModule } from './practice/practice.module';
import { PvpModule } from './pvp/pvp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        MONGO_URI: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    QuestionsModule,
    SetsModule,
    PracticeModule,
    PvpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
