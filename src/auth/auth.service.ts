import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { UserRepository } from 'src/database/repositories'
import { RegisterDto } from './dtos/register.dto'
import { Role } from 'src/utils/types'
import { UserDocument } from 'src/database/models'
import { LoginDto } from './dtos/login.dto'
import { compareSync } from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { sign } from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly UserRepository: UserRepository,
  ) {}

  async register(registerDto: RegisterDto, role: Role) {
    const user = await this.UserRepository.create({ ...registerDto, role })
    const { password, ...rest } = user.toObject<UserDocument>()
    return rest
  }

  async login(loginDto: LoginDto) {
    const registeredUser = await this.UserRepository.findOne({ username: loginDto.username }, {}, { lean: true })
    if (!registeredUser) throw new BadRequestException('No registered user with provided username.')

    const passwordMatches = compareSync(loginDto.password, registeredUser.password)
    if (!passwordMatches) throw new UnauthorizedException('Invalid password provided.')

    const token = sign({ id: registeredUser._id }, this.configService.get('JWT_SECRET'), { expiresIn: '24h' })
    const { password, ...rest } = registeredUser

    return { user: rest, token }
  }
}
