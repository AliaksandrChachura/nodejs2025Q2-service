import { ApiProperty } from '@nestjs/swagger';

export class ArtistResponseDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The artist ID',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ 
    example: 'Freddie Mercury',
    description: 'The artist name',
    minLength: 3,
    maxLength: 255,
  })
  name: string;

  @ApiProperty({ 
    example: false,
    description: 'Whether the artist has won a Grammy award',
  })
  grammy: boolean;
}