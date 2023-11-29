import { ConfigService } from '@nestjs/config'
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Authorize } from 'src/auth/guards/authorize.guard'
import { SocketSessions } from 'src/utils/providers/socket-session-manager.service'
import { PracticeResultManager } from './result-manager.service'
import { EVENTS } from 'src/utils/constants'
import { CancelPayload, SelectOptionPayload, SetStartTimePayload } from 'src/utils/interfaces'

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

  @SubscribeMessage(EVENTS.SET_START_TIME)
  handleSetStartTime(payload: SetStartTimePayload) {
    this.practiceResultManager.setStartTime(payload.userId)
  }

  @SubscribeMessage(EVENTS.SELECT_OPTION)
  handleSelectOption(payload: SelectOptionPayload) {
    this.practiceResultManager.selectOption(payload.userId, payload.questionIndex, payload.optionIndex)
  }

  @SubscribeMessage(EVENTS.CANCEL)
  handleCancel(payload: CancelPayload) {
    this.practiceResultManager.cancel(payload.userId)
  }
}
