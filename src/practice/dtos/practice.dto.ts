import { BadRequestException } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'

export class PracticeDto {
  @Transform(({ value }) => {
    const isValid = Types.ObjectId.isValid(value)
    if (!isValid) throw new BadRequestException(['Invalid set id.'])

    return new Types.ObjectId(value)
  })
  @IsNotEmpty()
  setId: Types.ObjectId
}
