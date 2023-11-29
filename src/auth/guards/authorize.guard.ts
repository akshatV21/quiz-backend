import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { verify } from 'jsonwebtoken'
import { UserRepository } from 'src/database/repositories'
import { RBAs } from 'src/utils/constants'
import { AuthOptions } from 'src/utils/interfaces'

@Injectable()
export class Authorize implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly UserRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { isLive, isOpen, roles, permission } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())

    if (!isLive) throw new InternalServerErrorException('This endpoint is currently not live.')
    if (isOpen) return true

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    const token = authHeader.split(' ')[1]
    const { id } = Authorize.validateToken(token, this.configService.get('JWT_SECRET'))

    const user = await this.UserRepository.findById(id, { sets: 0, stats: 0 })

    if (!user) throw new UnauthorizedException('User not found.')
    if (user.banned) throw new ForbiddenException('You are banned from using this platform.')

    if (!roles.includes(user.role)) throw new ForbiddenException('You are not allowed to access this endpoint.')
    if (!RBAs[user.role].includes(permission) || user.blocked.includes(permission))
      throw new ForbiddenException('You are not allowed to perform this action.')

    return true
  }

  static authorizeWsRequest(token: string, secret: string): any {
    const { id } = Authorize.validateToken(token, secret)
    return id
  }

  static validateToken(token: string, secret: string): any {
    return verify(token, secret, (err, payload) => {
      // when jwt is valid
      if (!err) return payload

      // when jwt has expired
      if (err.name === 'TokenExpiredError') throw new UnauthorizedException('Token has expired.', 'TokenExpired')

      // throws error when jwt is malformed
      throw new UnauthorizedException('Invalid token provided.', 'InvalidToken')
    })
  }
}
