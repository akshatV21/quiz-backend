import { ENTITIES, ROLES, USER_ACTIONS, SUBMISSION_ACTIONS, ACTIONS, TOPICS, SETS_STATUS } from '../constants'

export type Role = (typeof ROLES)[keyof typeof ROLES]

export type Entity = (typeof ENTITIES)[keyof typeof ENTITIES]

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS]

export type UserAction = (typeof USER_ACTIONS)[keyof typeof USER_ACTIONS]

export type SubmissionAction = (typeof SUBMISSION_ACTIONS)[keyof typeof SUBMISSION_ACTIONS]

type UserPermission = `${typeof ENTITIES.USER}:${UserAction}`

type SubmissionPermission = `${typeof ENTITIES.SUBMISSION}:${SubmissionAction}`

export type Permission = `${Entity}:${Action}` | UserPermission | SubmissionPermission

export type HttpSuccessResponse = Promise<{
  success: true
  message: string
  data: any
}>

export type Topic = (typeof TOPICS)[keyof typeof TOPICS]

export type Serial = `${number}${number}${number}${number}`

export type SetStatus = (typeof SETS_STATUS)[keyof typeof SETS_STATUS]
