import { Module } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { QuestionsController } from './questions.controller'
import { DatabaseModule } from 'src/database/database.module'
import { Question, QuestionSchema } from 'src/database/models'
import { QuestionRepository } from 'src/database/repositories'

@Module({
  imports: [DatabaseModule.forFeature([{ name: Question.name, schema: QuestionSchema }])],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionRepository],
})
export class QuestionsModule {}
