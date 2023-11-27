import { BadRequestException } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'
import { TOPICS } from 'src/utils/constants'
import { Topic } from 'src/utils/types'

export class CreateSetDto {
  @IsEnum(TOPICS)
  @IsNotEmpty()
  topic: Topic

  @Transform(({ value }) => {
    return value.map((questionId: string) => {
      const isValid = Types.ObjectId.isValid(questionId)
      if (!isValid) throw new BadRequestException(['Invalid question id.'])

      return new Types.ObjectId(questionId)
    })
  })
  @IsNotEmpty()
  questions: Types.ObjectId[]
}
