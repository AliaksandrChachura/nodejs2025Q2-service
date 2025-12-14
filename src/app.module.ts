import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { TrackModule } from './tracks/track.module';
import { ArtistModule } from './artists/artist.module';
import { AlbumModule } from './albums/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingModule } from './logging/logging.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    LoggingModule,
    AuthModule,
    UsersModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoritesModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
