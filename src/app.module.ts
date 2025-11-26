import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TrackModule } from './tracks/track.module';

@Module({
  imports: [UsersModule, TrackModule],
})

export class AppModule {}
