import { BadRequestException, Injectable } from '@nestjs/common'
import { QuestionRepository, SetRepository } from 'src/database/repositories'
import { CreateSetDto } from './dtos/create-set.dto'
import { generateSetSerial } from 'src/utils/functions'
import { ListSetsDto } from './dtos/list-sets.dto'
import { SETS_LIST_LIMIT } from 'src/utils/constants'
import { FilterQuery } from 'mongoose'
import { SetDocument } from 'src/database/models'

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

  async list(query: ListSetsDto) {
    const skip = (query.page - 1) * SETS_LIST_LIMIT

    const queryObj: FilterQuery<SetDocument> = {}
    if (query.topic) queryObj.topic = query.topic
    if (query.status) queryObj.status = query.status

    const sets = await this.SetRepository.find(queryObj, {}, { skip, limit: SETS_LIST_LIMIT })
    return sets
  }
}
