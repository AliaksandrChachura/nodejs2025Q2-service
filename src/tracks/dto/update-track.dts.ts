import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bohemian Rhapsody' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 355, description: 'In seconds' })
  duration: number;

  @IsOptional()
  @ValidateIf((o, value) => value !== null)
  @IsUUID()
  @ApiProperty({ format: 'uuid', nullable: true })
  artistId?: string | null;

  @IsOptional()
  @ValidateIf((o, value) => value !== null)
  @IsUUID()
  @ApiProperty({ format: 'uuid', nullable: true })
  albumId?: string | null;
}
