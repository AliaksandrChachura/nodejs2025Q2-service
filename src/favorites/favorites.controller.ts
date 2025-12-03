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
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import { TrackResponseDto } from 'src/tracks/dto/track-response.dto';
import { ArtistResponseDto } from 'src/artists/dto/artist-response.dto';
import { AlbumResponseDto } from 'src/albums/dto/album-response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Artist } from 'src/artists/interfaces/artist.interface';
import { Album } from 'src/albums/interfaces/album.interface';
import { Track } from 'src/tracks/interfaces/track.interface';
import { ErrorMessage } from 'src/helpers/constants';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: FavoritesResponseDto,
  })
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
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiResponse({
    status: 201,
    description: 'Added successfully',
    type: TrackResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.TrackNotFound,
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
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.TrackNotFound,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Accept', 'application/json')
  async deleteTrackFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.deleteTrackFromFavorites(id);
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiResponse({
    status: 201,
    description: 'Added successfully',
    type: ArtistResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.ArtistNotFound,
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
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.ArtistNotFound,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Accept', 'application/json')
  async deleteArtistFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.deleteArtistFromFavorites(id);
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Add album to the favorites' })
  @ApiResponse({
    status: 201,
    description: 'Added successfully',
    type: AlbumResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.AlbumNotFound,
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
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.AlbumNotFound,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Accept', 'application/json')
  async deleteAlbumFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favoritesService.deleteAlbumFromFavorites(id);
  }
}
