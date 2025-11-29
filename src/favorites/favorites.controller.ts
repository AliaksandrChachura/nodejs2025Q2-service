import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Header,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ArtistService } from 'src/artists/artist.service';
import { AlbumService } from 'src/albums/album.service';
import { TrackService } from 'src/tracks/track.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Artist } from 'src/artists/interfaces/artist.interface';
import { Album } from 'src/albums/interfaces/album.interface';
import { Track } from 'src/tracks/interfaces/track.interface';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Header('Accept', 'application/json')
  async findAll(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @ApiCreatedResponse({
    description: 'The track has been added to the favorites',
  })
  @HttpCode(HttpStatus.CREATED)
  @Header('Accept', 'application/json')
  async addTrackToFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Track> {
    await this.favoritesService.addTrackToFavorites(id);
    return this.trackService.findById(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Accept', 'application/json')
  async deleteTrackFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.deleteTrackFromFavorites(id);
  }

  @Post('artist/:id')
  @ApiCreatedResponse({
    description: 'The artist has been added to the favorites',
  })
  @HttpCode(HttpStatus.CREATED)
  @Header('Accept', 'application/json')
  async addArtistToFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Artist> {
    await this.favoritesService.addArtistToFavorites(id);
    return this.artistService.findById(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Accept', 'application/json')
  async deleteArtistFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.deleteArtistFromFavorites(id);
  }

  @Post('album/:id')
  @ApiCreatedResponse({
    description: 'The album has been added to the favorites',
  })
  @HttpCode(HttpStatus.CREATED)
  @Header('Accept', 'application/json')
  async addAlbumToFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Album> {
    await this.favoritesService.addAlbumToFavorites(id);
    return this.albumService.findById(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Accept', 'application/json')
  async deleteAlbumFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.deleteAlbumFromFavorites(id);
  }
}
