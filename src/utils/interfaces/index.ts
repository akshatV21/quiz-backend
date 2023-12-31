import { Socket } from 'socket.io'
import { UserDocument } from 'src/database/models'
import { Permission, Role, Topic } from '../types'

export interface AuthOptions {
  isLive?: boolean // is the endpoint currently accessible or not
  isOpen?: boolean // is the endpoint accessible without authentication or not
  roles?: Role[] // what roles are allowed to access the endpoint
  permission?: Permission // what permission is required to access the endpoint
}

export interface AuthUserDocument extends Omit<Omit<UserDocument, 'stats'>, 'sets'> {}

export interface PracticeResultInfo {
  resultId: string
  setId: string
  options: number[]
  startTime?: number
}

export interface AuthenticatedSocket extends Socket {
  entityId?: string
}

export interface SetStartTimePayload {
  userId: string
}

export interface SelectOptionPayload extends SetStartTimePayload {
  questionIndex: number
  optionIndex: number
}

export interface SubmitPayload extends SetStartTimePayload {}

export interface CancelPayload extends SetStartTimePayload {}

export interface UserPvpResultInfo {
  id: string
  options: number[]
  time: number
}

export interface PvpResultInfo {
  setId: string
  topic: Topic
  userIds: string[]
  users: Record<string, UserPvpResultInfo>
  winner: string
}

export interface PvpResultRegisterInfo {
  userId: string
  resultId: string
  setId: string
  topic: Topic
}
