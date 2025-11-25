import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  newPassword: string;
}