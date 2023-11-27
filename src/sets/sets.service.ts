import { BadRequestException, Injectable } from '@nestjs/common'
import { QuestionRepository, SetRepository } from 'src/database/repositories'
import { CreateSetDto } from './dtos/create-set.dto'
import { generateSetSerial } from 'src/utils/functions'

@Injectable()
export class SetsService {
  constructor(
    private readonly SetRepository: SetRepository,
    private readonly QuestionRepository: QuestionRepository,
  ) {}

  async create(createSetDto: CreateSetDto) {
    const questions = await this.QuestionRepository.find({ _id: { $in: createSetDto.questions } })

    const usedQuestions = questions.some(question => question.usedInSet)
    if (usedQuestions) throw new BadRequestException('Some questions are already used in a set.')

    const invalidTopic = questions.some(question => question.topic !== createSetDto.topic)
    if (invalidTopic) throw new BadRequestException('Some questions do not match the topic of the set.')

    const transaction = await this.SetRepository.startTransaction()

    try {
      const createSetPromise = await this.SetRepository.create({
        topic: createSetDto.topic,
        questions: createSetDto.questions,
        serial: generateSetSerial(),
        status: createSetDto.questions.length === 10 ? 'completed' : 'incomplete',
      })

      const updateQuestionsPromise = await this.QuestionRepository.updateMany({ _id: { $in: createSetDto.questions } }, { usedInSet: true })

      const [createdSet] = await Promise.all([createSetPromise, updateQuestionsPromise])

      await transaction.commitTransaction()
      return createdSet
    } catch (error) {
      await transaction.abortTransaction()
      throw error
    }
  }
}
