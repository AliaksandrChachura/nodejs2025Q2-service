import { IsOptional, IsString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsOptional()
  @IsString()
  refreshToken: string;
}
