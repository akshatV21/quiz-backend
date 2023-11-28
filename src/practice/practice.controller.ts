import { Body, Controller, Post } from '@nestjs/common'
import { PracticeService } from './practice.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { PracticeDto } from './dtos/practice.dto'
import { HttpSuccessResponse } from 'src/utils/types'
import { AuthUser } from 'src/auth/decorators/auth-user.decorator'
import { AuthUserDocument } from 'src/utils/interfaces'

@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  @Auth({ roles: ['user', 'moderator', 'admin'], permission: 'practice:play' })
  async httpPracticeSet(@Body() practiceDto: PracticeDto, @AuthUser() user: AuthUserDocument): HttpSuccessResponse {
    const result = await this.practiceService.create(practiceDto, user)
    return { success: true, message: 'Practice result created successfully.', data: { result } }
  }
}
