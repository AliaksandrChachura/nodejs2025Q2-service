import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  duration: number;

  @IsOptional()
  @ValidateIf((o, value) => value !== null)
  @IsUUID()
  @ApiProperty()
  artistId?: string | null;

  @IsOptional()
  @ValidateIf((o, value) => value !== null)
  @IsUUID()
  @ApiProperty()
  albumId?: string | null;
}
