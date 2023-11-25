import { Injectable } from '@nestjs/common'
import { AbstractRepository } from './abstract.repository'
import { Question, QuestionDocument } from '../models'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'

@Injectable()
export class QuestionRepository extends AbstractRepository<QuestionDocument, Question> {
  constructor(@InjectModel(Question.name) QuestionModel: Model<QuestionDocument>, @InjectConnection() connection: Connection) {
    super(QuestionModel, connection)
  }
}
