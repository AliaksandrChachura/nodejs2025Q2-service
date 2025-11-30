import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePasswordDto as IUpdatePasswordDto } from '../interfaces/update-password.interface';

class UpdateUserDto implements IUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty()
  newPassword: string;
}

export { UpdateUserDto };
