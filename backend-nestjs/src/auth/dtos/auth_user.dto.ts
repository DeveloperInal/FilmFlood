// UserValidationDto
import { IsEmail, IsNotEmpty, IsStrongPassword, IsUUID, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail({}, { message: 'Неверная электронная почта' })
  email: string;

  @IsStrongPassword({ minLength: 6, minUppercase: 1 }, { message:  'Пароль слишком легкий!' })
  password: string;
}

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  username: string;

  constructor(model: { email: string; id: string; username: string }) {
    this.email = model.email;
    this.id = model.id;
    this.username = model.username;
  }
}
