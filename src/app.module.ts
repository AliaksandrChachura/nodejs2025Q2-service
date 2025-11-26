import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TrackModule } from './tracks/track.module';
import { ArtistModule } from './artists/artist.module';

@Module({
  imports: [UsersModule, TrackModule, ArtistModule],
})

export class AppModule {}
