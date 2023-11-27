import { Module } from '@nestjs/common';
import { SetsService } from './sets.service';
import { SetsController } from './sets.controller';
import { DatabaseModule } from 'src/database/database.module'
import { Question, QuestionSchema, Set, SetSchema } from 'src/database/models'
import { QuestionRepository, SetRepository } from 'src/database/repositories'

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Set.name, schema: SetSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [SetsController],
  providers: [SetsService, SetRepository, QuestionRepository],
})
export class SetsModule {}
