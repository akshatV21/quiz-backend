import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Serial, SetStatus, Topic } from 'src/utils/types'

export type SetDocument = Set & Document

@Schema({ timestamps: true })
export class Set {
  @Prop({ required: true })
  serial: Serial

  @Prop({ required: true })
  topic: Topic

  @Prop({ required: true, ref: 'Question' })
  questions: Types.ObjectId[]

  @Prop({ required: true })
  status: SetStatus
}

export const SetSchema = SchemaFactory.createForClass(Set)
