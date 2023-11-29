import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type PracticeResultDocument = PracticeResult & Document

@Schema({ _id: false })
class PracticeOptionsSchema {
  @Prop({ default: [] })
  selected: number[]

  @Prop({ default: 0 })
  correct: number

  @Prop({ default: 0 })
  skipped: number
}

@Schema({ _id: false })
export class TimeSchema {
  @Prop({ default: null })
  start: number

  @Prop({ default: null })
  end: number
}

@Schema({ timestamps: true })
export class PracticeResult {
  @Prop({ required: true, ref: 'User' })
  user: Types.ObjectId

  @Prop({ required: true, ref: 'Set' })
  set: Types.ObjectId

  @Prop({ default: new PracticeOptionsSchema() })
  options?: PracticeOptionsSchema

  @Prop({ default: new TimeSchema() })
  time?: TimeSchema
}

export const PracticeResultSchema = SchemaFactory.createForClass(PracticeResult)
