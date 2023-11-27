import { IsMongoId, IsNotEmpty, IsNotEmptyObject, ValidateNested } from 'class-validator'
import { Types } from 'mongoose'
import { Transform } from 'class-transformer'
import { QuestionDto } from './create-questions.dto'

export class UpdateQuestionDto {
  @Transform(() => Types.ObjectId)
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId

  @ValidateNested()
  @IsNotEmptyObject()
  question: Partial<QuestionDto>
}
