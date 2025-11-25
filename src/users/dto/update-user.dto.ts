import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { UpdatePasswordDto as IUpdatePasswordDto } from '../interfaces/update-password.interface';

class UpdateUserDto implements IUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  newPassword: string;
}

export { UpdateUserDto };