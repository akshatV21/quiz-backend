import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { TOPICS } from 'src/utils/constants'
import { Topic } from 'src/utils/types'

export class ListResultsDto {
  @IsEnum(TOPICS, { each: true })
  @Transform(({ value }) => value.split(',') as Topic[])
  @IsNotEmpty()
  topics: Topic

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  page: number
}
