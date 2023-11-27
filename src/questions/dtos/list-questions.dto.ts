import { Transform } from 'class-transformer'
import { ArrayMinSize, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { TOPICS } from 'src/utils/constants'
import { Topic } from 'src/utils/types'

export class ListQuestionsDto {
  @IsEnum(TOPICS, { each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  topics: Topic[]

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  page: number

  @IsBoolean()
  @IsOptional()
  usedInSet?: boolean
}
