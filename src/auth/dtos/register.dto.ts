import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @MaxLength(20)
  @MinLength(4)
  @IsString()
  @IsNotEmpty()
  username: string

  @MaxLength(20)
  @MinLength(4)
  @IsString()
  @IsNotEmpty()
  password: string
}
