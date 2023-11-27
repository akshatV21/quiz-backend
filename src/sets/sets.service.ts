import { BadRequestException, Injectable } from '@nestjs/common'
import { QuestionRepository, SetRepository } from 'src/database/repositories'
import { CreateSetDto } from './dtos/create-set.dto'
import { generateSetSerial } from 'src/utils/functions'
import { ListSetsDto } from './dtos/list-sets.dto'
import { QUESTIONS_LIMIT_IN_SET, SETS_LIST_LIMIT } from 'src/utils/constants'
import { FilterQuery, UpdateQuery } from 'mongoose'
import { SetDocument } from 'src/database/models'
import { AddQuestionDto } from './dtos/add-question.dto'
import { RemoveQuestionDto } from './dtos/remove-question.dto'

@Injectable()
export class SetsService {
  constructor(
    private readonly SetRepository: SetRepository,
    private readonly QuestionRepository: QuestionRepository,
  ) {}

  async create(createSetDto: CreateSetDto) {
    const questions = await this.QuestionRepository.find({ _id: { $in: createSetDto.questions } })
    if (questions.length !== createSetDto.questions.length) throw new BadRequestException('Some questions do not exist.')

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
        status: createSetDto.questions.length === QUESTIONS_LIMIT_IN_SET ? 'completed' : 'incomplete',
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

  async getById(setId: string) {
    const set = await this.SetRepository.findById(setId, {}, { populate: { path: 'questions', select: 'question options' } })
    return set
  }

  async list(query: ListSetsDto) {
    const skip = (query.page - 1) * SETS_LIST_LIMIT

    const queryObj: FilterQuery<SetDocument> = {}
    if (query.topic) queryObj.topic = query.topic
    if (query.status) queryObj.status = query.status

    const sets = await this.SetRepository.find(queryObj, {}, { skip, limit: SETS_LIST_LIMIT })
    return sets
  }

  async addQuestion({ setId, questionId }: AddQuestionDto) {
    const getSetPromise = this.SetRepository.findById(setId)
    const getQuestionPromise = this.QuestionRepository.findById(questionId)

    const [set, question] = await Promise.all([getSetPromise, getQuestionPromise])

    if (!set) throw new BadRequestException('Set does not exist.')
    if (!question) throw new BadRequestException('Question does not exist.')
    if (set.status === 'completed') throw new BadRequestException('Set is already completed.')
    if (question.usedInSet) throw new BadRequestException('Question is already used in a set.')
    if (set.topic !== question.topic) throw new BadRequestException('Question does not match the topic of the set.')

    const transaction = await this.SetRepository.startTransaction()

    try {
      const setUpdateQuery: UpdateQuery<SetDocument> = { $push: { questions: questionId } }
      if (set.questions.length + 1 === QUESTIONS_LIMIT_IN_SET) setUpdateQuery.$set = { status: 'completed' }

      const updateSetPromise = this.SetRepository.update(setId, setUpdateQuery)
      const updateQuestionPromise = this.QuestionRepository.update(questionId, { usedInSet: true })

      const [updatedSet] = await Promise.all([updateSetPromise, updateQuestionPromise])

      await transaction.commitTransaction()
      return updatedSet
    } catch (error) {
      await transaction.abortTransaction()
      throw error
    }
  }

  async removeQuestion({ setId, questionId }: RemoveQuestionDto) {
    const getSetPromise = this.SetRepository.findById(setId, {}, { lean: true })
    const getQuestionPromise = this.QuestionRepository.findById(questionId, {}, { lean: true })

    const [set, question] = await Promise.all([getSetPromise, getQuestionPromise])

    if (!set) throw new BadRequestException('Set does not exist.')
    if (!question) throw new BadRequestException('Question does not exist.')
    if (!question.usedInSet) throw new BadRequestException('Question is not used in a set.')
    if (!set.questions.includes(question._id)) throw new BadRequestException('Question is not used in this set.')

    const transaction = await this.SetRepository.startTransaction()

    try {
      const setUpdateQuery: UpdateQuery<SetDocument> = { $pull: { questions: questionId } }
      if (set.questions.length - 1 < QUESTIONS_LIMIT_IN_SET) setUpdateQuery.$set = { status: 'incomplete' }

      const updateSetPromise = this.SetRepository.update(setId, setUpdateQuery)
      const updateQuestionPromise = this.QuestionRepository.update(questionId, { usedInSet: false })

      const [updatedSet] = await Promise.all([updateSetPromise, updateQuestionPromise])

      await transaction.commitTransaction()
      return updatedSet
    } catch (error) {
      await transaction.abortTransaction()
      throw error
    }
  }
}
