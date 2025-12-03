import { ApiProperty } from '@nestjs/swagger';

export class AlbumResponseDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The album ID',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ description: 'The album name', example: 'Innuendo' })
  name: string;

  @ApiProperty({ description: 'The album year', example: 1991 })
  year: number;

  @ApiProperty({ format: 'uuid', nullable: true, description: 'The artist ID' })
  artistId?: string | null;
}