import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator'
import { SETS_STATUS, TOPICS } from 'src/utils/constants'
import { SetStatus, Topic } from 'src/utils/types'

export class ListSetsDto {
  @IsEnum(TOPICS)
  @IsNotEmpty()
  @ValidateIf(obj => !obj.status || obj.topic)
  topic: Topic

  @IsEnum(SETS_STATUS)
  @IsNotEmpty()
  @ValidateIf(obj => !obj.topic || obj.status)
  status: SetStatus

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  page: number
}
