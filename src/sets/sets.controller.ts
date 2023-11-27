import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { SetsService } from './sets.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateSetDto } from './dtos/create-set.dto'
import { HttpSuccessResponse } from 'src/utils/types'
import { ListSetsDto } from './dtos/list-sets.dto'
import { AddQuestionDto } from './dtos/add-question.dto'
import { RemoveQuestionDto } from './dtos/remove-question.dto'

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post()
  @Auth({ roles: ['admin'], permission: 'set:create' })
  async httpCreateSet(@Body() createSetDto: CreateSetDto): HttpSuccessResponse {
    const set = await this.setsService.create(createSetDto)
    return { success: true, message: 'Set created successfully.', data: { set } }
  }

  @Get('list')
  @Auth({ roles: ['admin'], permission: 'set:read' })
  async httpListSets(@Query() query: ListSetsDto): HttpSuccessResponse {
    const sets = await this.setsService.list(query)
    return { success: true, message: 'Sets fetched successfully.', data: { sets } }
  }

  @Get(':id')
  @Auth({ roles: ['admin'], permission: 'set:read' })
  async httpGetSetById(@Param('id') setId: string): HttpSuccessResponse {
    const set = await this.setsService.getById(setId)
    return { success: true, message: 'Set fetched successfully.', data: { set } }
  }

  @Patch('add-question')
  @Auth({ roles: ['admin'], permission: 'set:update' })
  async httpAddQuestionToSet(@Body() addQuestionDto: AddQuestionDto) {
    const set = await this.setsService.addQuestion(addQuestionDto)
    return { success: true, message: 'Question added to set successfully.', data: { set } }
  }

  @Patch('remove-question')
  @Auth({ roles: ['admin'], permission: 'set:update' })
  async httpRemoveQuestionFromSet(@Body() removeQuestionDto: RemoveQuestionDto) {
    const set = await this.setsService.removeQuestion(removeQuestionDto)
    return { success: true, message: 'Question removed from set successfully.', data: { set } }
  }

  @Patch('topic')
  @Auth({ roles: ['admin'], permission: 'set:update' })
  async httpUpdateSetTopic(@Body() updateSetTopicDto: { id: string; topic: string }) {
    const set = await this.setsService.updateTopic(updateSetTopicDto)
    return { success: true, message: 'Set topic updated successfully.', data: { set } }
  }
}
