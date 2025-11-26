import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsOptional()
  @ValidateIf((o, value) => value !== null)
  @IsUUID()
  artistId?: string | null;

  @IsOptional()
  @ValidateIf((o, value) => value !== null)
  @IsUUID()
  albumId?: string | null;
}

