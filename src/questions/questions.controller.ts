import { Body, Controller, Get, ParseEnumPipe, Patch, Post, Query } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateQuestionsDto } from './dtos/create-questions.dto'
import { HttpSuccessResponse } from 'src/utils/types'
import { ListQuestionsDto } from './dtos/list-questions.dto'
import { UpdateQuestionDto } from './dtos/update-question.dto'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Auth({ roles: ['admin'], permission: 'question:create' })
  async httpCreateQuestions(@Body() createQuestionsDto: CreateQuestionsDto): HttpSuccessResponse {
    const questions = await this.questionsService.create(createQuestionsDto)
    return { success: true, message: 'Questions created successfully.', data: { questions } }
  }

  @Get('list')
  @Auth({ roles: ['admin'], permission: 'question:read' })
  async httpListQuestions(@Query() query: ListQuestionsDto) {
    const questions = await this.questionsService.list(query)
    return { success: true, message: 'Questions listed successfully.', data: { questions } }
  }

  @Patch('update')
  @Auth({ roles: ['admin'], permission: 'question:update' })
  async httpUpdateQuestion(@Body() updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionsService.update(updateQuestionDto)
    return { success: true, message: 'Question updated successfully.', data: { question } }
  }
}
