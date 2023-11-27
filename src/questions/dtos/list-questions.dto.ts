import { BadRequestException } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { ArrayMinSize, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { TOPICS } from 'src/utils/constants'
import { Topic } from 'src/utils/types'

export class ListQuestionsDto {
  @IsEnum(TOPICS, { each: true })
  @ArrayMinSize(1)
  @Transform(({ value }) => value.split(','))
  @IsNotEmpty()
  topics: Topic[]

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  page: number

  @Transform(({ value }) => {
    if (value === 'true') return true
    if (value === 'false') return false

    throw new BadRequestException(['usedInSet must be a boolean.'])
  })
  @IsOptional()
  usedInSet?: boolean
}
