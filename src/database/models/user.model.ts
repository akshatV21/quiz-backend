import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { hashSync } from 'bcrypt'
import { Permission, Role } from 'src/utils/types'

export type UserDocument = User & Document

@Schema({ _id: false })
export class UserSetsSchema {
  @Prop({ default: [], ref: 'Set' })
  practice: Types.ObjectId[]

  @Prop({ default: [], ref: 'Set' })
  versus: Types.ObjectId[]
}

@Schema({ _id: false })
export class UserStatsSchema {
  @Prop({ default: 0 })
  sets: number

  @Prop({ default: 0 })
  wins: number

  @Prop({ default: 0 })
  losses: number

  @Prop({ default: 0 })
  draws: number
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, minlength: 3, maxlength: 20, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  role: Role

  @Prop({ default: new UserSetsSchema() })
  sets?: UserSetsSchema

  @Prop({ default: new UserStatsSchema() })
  stats?: UserStatsSchema

  @Prop({ default: false })
  banned?: boolean

  @Prop({ default: [] })
  blocked?: Permission[]
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  this.password = hashSync(this.password, 10)
  return next()
})

export { UserSchema }
