import { Injectable } from '@nestjs/common'
import { AbstractRepository } from './abstract.repository'
import { PracticeResult, PracticeResultDocument } from '../models'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'

@Injectable()
export class PracticeResultRepository extends AbstractRepository<PracticeResultDocument, PracticeResult> {
  constructor(
    @InjectModel(PracticeResult.name) PracticeResultModel: Model<PracticeResultDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(PracticeResultModel, connection)
  }
}
