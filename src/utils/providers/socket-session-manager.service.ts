import { Injectable } from '@nestjs/common'
import { AuthenticatedSocket } from '../interfaces'
import { Types } from 'mongoose'

@Injectable()
export class SocketSessions {
  private sessions: Map<string, AuthenticatedSocket> = new Map()

  getSocket(id: string) {
    return this.sessions.get(id)
  }

  setSocket(userId: string, socket: AuthenticatedSocket) {
    this.sessions.set(userId, socket)
  }

  removeSocket(userId: string) {
    this.sessions.delete(userId)
  }

  getSockets(): Map<string, AuthenticatedSocket> {
    return this.sessions
  }

  getUserId(socketId: string): string {
    return [...this.sessions.entries()].find(([_, s]) => s.id === socketId)[0]
  }
}
