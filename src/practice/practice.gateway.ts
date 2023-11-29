import { ConfigService } from '@nestjs/config'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Authorize } from 'src/auth/guards/authorize.guard'
import { SocketSessions } from 'src/utils/providers/socket-session-manager.service'
import { PracticeResultManager } from './result-manager.service'

@WebSocketGateway({ namespace: 'practice', cors: { origin: '*' } })
export class PracticeGateway {
  @WebSocketServer()
  private server: Server

  constructor(
    private readonly configService: ConfigService,
    private readonly socketSessions: SocketSessions,
    private readonly practiceResultManager: PracticeResultManager,
  ) {}

  handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token ?? socket.handshake.headers.token
    const userId = Authorize.authorizeWsRequest(token, this.configService.get('JWT_SECRET'))

    this.socketSessions.setSocket(userId, socket)
  }

  handleDisconnect(socket: Socket) {
    const userId = this.socketSessions.getUserId(socket.id)

    this.socketSessions.removeSocket(userId)
    this.practiceResultManager.cancel(userId)
  }
}
