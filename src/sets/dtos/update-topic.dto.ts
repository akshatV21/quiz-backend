import { BadRequestException } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'
import { TOPICS } from 'src/utils/constants'
import { Topic } from 'src/utils/types'

export class UpdateTopicDto {
  @IsEnum(TOPICS)
  @IsNotEmpty()
  topic: Topic

  @Transform(({ value }) => {
    const isValid = Types.ObjectId.isValid(value)
    if (!isValid) throw new BadRequestException(['Invalid set id.'])

    return new Types.ObjectId(value)
  })
  @IsNotEmpty()
  setId: Types.ObjectId
}
