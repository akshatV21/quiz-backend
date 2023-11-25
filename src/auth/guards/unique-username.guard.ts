import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common'
import { UserRepository } from 'src/database/repositories'

@Injectable()
export class UniqueUsernameGuard implements CanActivate {
  constructor(private readonly UserRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const body = context.switchToHttp().getRequest().body
    const exists = await this.UserRepository.exists({ username: body.username })
    if (exists) throw new BadRequestException('Username already exists.')

    return true
  }
}
