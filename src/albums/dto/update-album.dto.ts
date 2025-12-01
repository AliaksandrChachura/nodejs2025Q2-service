import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  ValidateIf,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Innuendo' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1991 })
  year: number;

  @IsOptional()
  @ValidateIf((o, value) => value !== null)
  @IsUUID()
  @ApiProperty({ format: 'uuid', nullable: true })
  artistId?: string | null;
}
