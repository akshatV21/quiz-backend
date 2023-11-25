import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { HttpSuccessResponse } from 'src/utils/types'
import { RegisterDto } from './dtos/register.dto'
import { LoginDto } from './dtos/login.dto'
import { UniqueUsernameGuard } from './guards/unique-username.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth({ isOpen: true })
  @UseGuards(UniqueUsernameGuard)
  async httpRegisterUser(@Body() registerDto: RegisterDto): HttpSuccessResponse {
    const user = await this.authService.register(registerDto, 'user')
    return { success: true, message: 'User registered successfully.', data: { user } }
  }

  @Post('login')
  @Auth({ isOpen: true })
  async httpLoginUser(@Body() loginDto: LoginDto): HttpSuccessResponse {
    const res = await this.authService.login(loginDto)
    return { success: true, message: 'User logged in successfully.', data: res }
  }

  @Post('register/moderator')
  @Auth({ roles: ['admin'], permission: 'user:create' })
  @UseGuards(UniqueUsernameGuard)
  async httpRegisterModerator(@Body() registerDto: RegisterDto): HttpSuccessResponse {
    const user = await this.authService.register(registerDto, 'moderator')
    return { success: true, message: 'Moderator registered successfully.', data: { user } }
  }

  @Post('register/admin')
  @Auth({ roles: ['admin'], permission: 'user:create' })
  @UseGuards(UniqueUsernameGuard)
  async httpRegisterAdmin(@Body() registerDto: RegisterDto): HttpSuccessResponse {
    const user = await this.authService.register(registerDto, 'admin')
    return { success: true, message: 'Admin registered successfully.', data: { user } }
  }
}
