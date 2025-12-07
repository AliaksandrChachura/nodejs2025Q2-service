import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto as ICreateUserDto } from '../interfaces/create-user.interface';

class CreateUserDto implements ICreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty({ example: 'TestUser' })
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @ApiProperty()
  password: string;
}

export { CreateUserDto };
