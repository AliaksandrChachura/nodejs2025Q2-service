import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Freddie Mercury' })
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: false })
  grammy: boolean;
}
