import { BadRequestException } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumberString, MaxLength, MinLength, ValidateIf } from 'class-validator'
import { Types } from 'mongoose'
import { Serial } from 'src/utils/types'

export class GetResultDto {
  @Transform(({ value }) => {
    const isValid = Types.ObjectId.isValid(value)
    if (!isValid) throw new BadRequestException(['Invalid set id.'])

    return new Types.ObjectId(value)
  })
  @IsNotEmpty()
  @ValidateIf(o => o.resultId || !o.serial)
  resultId: Types.ObjectId

  @MaxLength(4)
  @MinLength(4)
  @IsNumberString()
  @IsNotEmpty()
  @ValidateIf(o => o.serial || !o.resultId)
  serial: Serial
}
