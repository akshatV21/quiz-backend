import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Topic } from 'src/utils/types'

export type QuestionDocument = Question & Document

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  question: string

  @Prop({ required: true })
  options: string[]

  @Prop({ required: true })
  answer: string

  @Prop({ required: true })
  topic: Topic

  @Prop({ default: false })
  usedInSet?: boolean
}

export const QuestionSchema = SchemaFactory.createForClass(Question)
