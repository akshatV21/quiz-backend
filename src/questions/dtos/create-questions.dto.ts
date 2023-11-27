import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString, ValidateBy, ValidateNested } from 'class-validator'
import { TOPICS } from 'src/utils/constants'
import { Topic } from 'src/utils/types'

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string

  @IsString({ each: true })
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  @IsNotEmpty()
  options: string[]

  @ValidateBy({
    name: 'isCorrectAnswer',
    validator: {
      validate(value: string, args: any) {
        return args.object.options.includes(value)
      },
      defaultMessage(args: any) {
        return `${args.property} is not present in the options array.`
      },
    },
  })
  @IsString()
  @IsNotEmpty()
  answer: string

  @IsEnum(TOPICS)
  @IsNotEmpty()
  topic: Topic
}

export class CreateQuestionsDto {
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  questions: QuestionDto[]
}
