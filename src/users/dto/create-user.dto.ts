import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { CreateUserDto as ICreateUserDto } from '../interfaces/create-user.interface';

class CreateUserDto implements ICreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}

export { CreateUserDto };