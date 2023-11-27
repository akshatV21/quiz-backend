import { Injectable } from '@nestjs/common'
import { AbstractRepository } from './abstract.repository'
import { Set, SetDocument } from '../models'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'

@Injectable()
export class SetRepository extends AbstractRepository<SetDocument, Set> {
  constructor(@InjectModel(Set.name) SetModel: Model<SetDocument>, @InjectConnection() connection: Connection) {
    super(SetModel, connection)
  }
}
