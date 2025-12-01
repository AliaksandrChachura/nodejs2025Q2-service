import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { UsersModule } from 'src/users/users.module';
import { ArtistModule } from 'src/artists/artist.module';
import { AlbumModule } from 'src/albums/album.module';
import { TrackModule } from 'src/tracks/track.module';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [UsersModule, ArtistModule, AlbumModule, TrackModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
