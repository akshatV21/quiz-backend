import { Body, Controller, Post } from '@nestjs/common'
import { SetsService } from './sets.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateSetDto } from './dtos/create-set.dto'
import { HttpSuccessResponse } from 'src/utils/types'

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post()
  @Auth({ roles: ['admin'], permission: 'set:create' })
  async httpCreateSet(@Body() createSetDto: CreateSetDto): HttpSuccessResponse {
    const set = await this.setsService.create(createSetDto)
    return { success: true, message: 'Set created successfully.', data: { set } }
  }
}
