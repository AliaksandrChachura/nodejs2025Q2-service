import { ApiProperty } from '@nestjs/swagger';

export class TrackResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The track ID',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    example: 'The Show Must Go On',
    description: 'The track name',
    minLength: 3,
    maxLength: 255,
  })
  name: string;

  @ApiProperty({ format: 'uuid', nullable: true })
  artistId?: string | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  albumId?: string | null;

  @ApiProperty({ example: 262, description: 'The track duration in seconds' })
  duration: number;
}
