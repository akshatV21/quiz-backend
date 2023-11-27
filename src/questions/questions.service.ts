import { Injectable } from '@nestjs/common'
import { QuestionRepository } from 'src/database/repositories'
import { CreateQuestionsDto } from './dtos/create-questions.dto'
import { ListQuestionsDto } from './dtos/list-questions.dto'
import { QUESTIONS_LIST_LIMIT } from 'src/utils/constants'
import { UpdateQuestionDto } from './dtos/update-question.dto'

@Injectable()
export class QuestionsService {
  constructor(private readonly QuestionRepository: QuestionRepository) {}

  async create({ questions }: CreateQuestionsDto) {
    const createdQuestions = await this.QuestionRepository.createMany(questions)
    return createdQuestions
  }

  async list(query: ListQuestionsDto) {
    const skip = (query.page - 1) * QUESTIONS_LIST_LIMIT
    const questions = await this.QuestionRepository.find(
      { topic: { $in: query.topics }, usedInSet: query.usedInSet ?? false },
      {},
      { skip, limit: QUESTIONS_LIST_LIMIT },
    )

    return questions
  }

  async update({ id, question }: UpdateQuestionDto) {
    const updatedQuestion = await this.QuestionRepository.update(id, question)
    return updatedQuestion
  }
}
