import { Artist } from 'src/artists/interfaces/artist.interface';
import { Album } from 'src/albums/interfaces/album.interface';
import { Track } from 'src/tracks/interfaces/track.interface';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  artists: Artist[];

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  albums: Album[];

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  tracks: Track[];
}
