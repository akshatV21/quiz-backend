import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common'
import { PracticeResultRepository, SetRepository, UserRepository } from 'src/database/repositories'
import { PracticeDto } from './dtos/practice.dto'
import { AuthUserDocument } from 'src/utils/interfaces'
import { FilterQuery, Types } from 'mongoose'
import { PracticeResultManager } from './result-manager.service'
import { GetResultDto } from './dtos/get-result.dto'
import { PracticeResultDocument } from 'src/database/models'
import { ListResultsDto } from './dtos/list-results.dto'
import { RESULTS_LIST_LIMIT } from 'src/utils/constants'

@Injectable()
export class PracticeService {
  constructor(
    private readonly SetRepository: SetRepository,
    private readonly UserRepository: UserRepository,
    private readonly PracticeResultManager: PracticeResultManager,
    private readonly PracticeResultRepository: PracticeResultRepository,
  ) {}

  async create({ setId }: PracticeDto, user: AuthUserDocument) {
    const set = await this.SetRepository.findById(setId, { serial: 1, topic: 1 })
    if (!set) throw new BadRequestException('Set does not exist.')

    const resultObjectId = new Types.ObjectId()
    const transaction = await this.PracticeResultRepository.startTransaction()

    try {
      const updateUserPromise = this.UserRepository.update(user._id, { $push: { 'results.practice': resultObjectId } })
      const createResultPromise = this.PracticeResultRepository.create(
        { user: user._id, set: setId, serial: set.serial, topic: set.topic },
        resultObjectId,
      )

      const [result] = await Promise.all([createResultPromise, updateUserPromise])
      await transaction.commitTransaction()

      this.PracticeResultManager.register(user.id, result.id, setId.toString())
      return result
    } catch (error) {
      await transaction.abortTransaction()
      throw error
    }
  }

  async getById(query: GetResultDto, user: AuthUserDocument) {
    const filterQuery: FilterQuery<PracticeResultDocument> = {}

    if (query.serial) filterQuery.serial = query.serial
    if (query.resultId) filterQuery._id = query.resultId

    const result = await this.PracticeResultRepository.findOne(filterQuery, {}, { lean: true })

    if (!result) throw new BadRequestException('Result does not exist.')
    if (result.user !== user.id) throw new ForbiddenException('Result does not belong to you.')

    return result
  }

  async list(query: ListResultsDto, user: AuthUserDocument) {
    const skip = (query.page - 1) * RESULTS_LIST_LIMIT
    const filterQuery: FilterQuery<PracticeResultDocument> = { user: user.id, topic: { $in: query.topics } }

    const results = await this.PracticeResultRepository.find(filterQuery, {}, { lean: true, skip, limit: RESULTS_LIST_LIMIT })
    return results
  }
}
