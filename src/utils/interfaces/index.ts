import { UserDocument } from 'src/database/models'
import { Permission, Role } from '../types'

export interface AuthOptions {
  isLive?: boolean // is the endpoint currently accessible or not
  isOpen?: boolean // is the endpoint accessible without authentication or not
  roles?: Role[] // what roles are allowed to access the endpoint
  permission?: Permission // what permission is required to access the endpoint
}

export interface AuthUserDocument extends Omit<Omit<UserDocument, 'stats'>, 'sets'> {}
