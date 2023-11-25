import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { DatabaseModule } from 'src/database/database.module'
import { User, UserSchema } from 'src/database/models'
import { UserRepository } from 'src/database/repositories'
import { Authorize } from './guards/authorize.guard'

@Module({
  imports: [DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: Authorize }, UserRepository],
})
export class AuthModule {}
