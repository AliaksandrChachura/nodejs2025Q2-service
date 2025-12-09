import { ApiProperty } from '@nestjs/swagger';
import { AlbumResponseDto } from 'src/albums/dto/album-response.dto';
import { ArtistResponseDto } from 'src/artists/dto/artist-response.dto';
import { TrackResponseDto } from 'src/tracks/dto/track-response.dto';

export class FavoritesResponseDto {
  @ApiProperty({ description: 'favorites artists', type: [ArtistResponseDto] })
  artists: ArtistResponseDto[];

  @ApiProperty({ description: 'favorites albums', type: [AlbumResponseDto] })
  albums: AlbumResponseDto[];

  @ApiProperty({ description: 'favorites tracks', type: [TrackResponseDto] })
  tracks: TrackResponseDto[];
}
