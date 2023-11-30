import { Body, Controller, Post, Get, Query } from '@nestjs/common'
import { PracticeService } from './practice.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { PracticeDto } from './dtos/practice.dto'
import { HttpSuccessResponse } from 'src/utils/types'
import { AuthUser } from 'src/auth/decorators/auth-user.decorator'
import { AuthUserDocument } from 'src/utils/interfaces'
import { GetResultDto } from './dtos/get-result.dto'
import { ListResultsDto } from './dtos/list-results.dto'

@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  @Auth({ roles: ['user', 'moderator', 'admin'], permission: 'practice:play' })
  async httpPracticeSet(@Body() practiceDto: PracticeDto, @AuthUser() user: AuthUserDocument): HttpSuccessResponse {
    const result = await this.practiceService.create(practiceDto, user)
    return { success: true, message: 'Practice result created successfully.', data: { result } }
  }

  @Get()
  @Auth({ roles: ['user', 'moderator', 'admin'], permission: 'practice:play' })
  async httpGetResult(@Query() getResultDto: GetResultDto, @AuthUser() user: AuthUserDocument) {
    const result = await this.practiceService.getById(getResultDto, user)
    return { success: true, message: 'Practice result retrieved successfully.', data: { result } }
  }

  @Get('list')
  @Auth({ roles: ['user', 'moderator', 'admin'], permission: 'practice:play' })
  async httpListResults(@Query() listResultsDto: ListResultsDto, @AuthUser() user: AuthUserDocument) {
    const results = await this.practiceService.list(listResultsDto, user)
    return { success: true, message: 'Practice results retrieved successfully.', data: { results } }
  }
}
