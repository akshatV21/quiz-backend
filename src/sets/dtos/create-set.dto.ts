import { Transform } from 'class-transformer'
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'
import { TOPICS } from 'src/utils/constants'
import { Topic } from 'src/utils/types'

export class CreateSetDto {
  @IsEnum(TOPICS)
  @IsNotEmpty()
  topic: Topic

  @Transform(({ value }) => value.map((id: string) => new Types.ObjectId(id)))
  @IsMongoId({ each: true })
  @IsNotEmpty()
  questions: Types.ObjectId[]
}
