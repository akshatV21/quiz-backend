import { Module } from '@nestjs/common'
import { PracticeService } from './practice.service'
import { PracticeController } from './practice.controller'
import { DatabaseModule } from 'src/database/database.module'
import { PracticeResult, PracticeResultSchema, Set, SetSchema, User, UserSchema } from 'src/database/models'
import { PracticeResultRepository, SetRepository, UserRepository } from 'src/database/repositories'
import { PracticeResultManager } from './result-manager.service'

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Set.name, schema: SetSchema },
      { name: User.name, schema: UserSchema },
      { name: PracticeResult.name, schema: PracticeResultSchema },
    ]),
  ],
  controllers: [PracticeController],
  providers: [PracticeService, SetRepository, UserRepository, PracticeResultRepository, PracticeResultManager],
})
export class PracticeModule {}
