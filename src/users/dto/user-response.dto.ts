import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The user ID',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    example: 'TestUser',
    description: 'The user login',
    minLength: 3,
    maxLength: 255,
  })
  login: string;

  @ApiProperty({
    example: 1,
    description: 'The user version',
  })
  version: number;

  @ApiProperty({
    example: 1655000000,
    description: 'The user creation timestamp',
  })
  createdAt: number;

  @ApiProperty({
    example: 1655000000,
    description: 'The user last update timestamp',
  })
  updatedAt: number;
}
