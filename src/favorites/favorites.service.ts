import { Injectable } from '@nestjs/common';
import { Favorites } from './interfaces/favorite.interface';
import { HttpException } from '@nestjs/common';
import { ErrorMessage, HttpStatus } from 'src/helpers/constants';
import { TrackService } from 'src/tracks/track.service';
import { ArtistService } from 'src/artists/artist.service';
import { AlbumService } from 'src/albums/album.service';
import { Artist } from 'src/artists/interfaces/artist.interface';
import { Album } from 'src/albums/interfaces/album.interface';
import { Track } from 'src/tracks/interfaces/track.interface';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class FavoritesService {
  private readonly FAVORITES_ID = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly loggingService: LoggingService,
  ) {}

  private async getOrCreateFavorites() {
    let favorites = await this.prisma.favorites.findUnique({
      where: { id: this.FAVORITES_ID },
    });

    if (!favorites) {
      favorites = await this.prisma.favorites.create({
        data: {
          id: this.FAVORITES_ID,
          favoriteArtists: [],
          favoriteAlbums: [],
          favoriteTracks: [],
        },
      });
    }

    return favorites;
  }

  async findAll(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    this.loggingService.debug('Fetching all favorites', 'FavoritesService');
    const favorites = await this.getOrCreateFavorites();

    const artistsResults = await Promise.all(
      favorites.favoriteArtists.map((id) => this.artistService.findById(id)),
    );
    const artists = artistsResults.filter(
      (artist): artist is Artist => artist !== null,
    );

    const albumsResults = await Promise.all(
      favorites.favoriteAlbums.map((id) => this.albumService.findById(id)),
    );
    const albums = albumsResults.filter(
      (album): album is Album => album !== null,
    );

    const tracksResults = await Promise.all(
      favorites.favoriteTracks.map((id) => this.trackService.findById(id)),
    );
    const tracks = tracksResults.filter(
      (track): track is Track => track !== null,
    );

    this.loggingService.verbose(
      `Found ${artists.length} favorite artists, ${albums.length} favorite albums, ${tracks.length} favorite tracks`,
      'FavoritesService',
    );
    return { artists, albums, tracks };
  }

  async addTrackToFavorites(id: string): Promise<Favorites> {
    this.loggingService.log(
      `Adding track to favorites: ${id}`,
      'FavoritesService',
    );
    const track = await this.trackService.findById(id);

    if (!track) {
      this.loggingService.warn(
        `Track not found when adding to favorites: ${id}`,
        'FavoritesService',
      );
      throw new HttpException(
        ErrorMessage.TrackNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.favoriteTracks.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: this.FAVORITES_ID },
        data: {
          favoriteTracks: [...favorites.favoriteTracks, id],
        },
      });
      this.loggingService.log(
        `Track added to favorites successfully: ${id}`,
        'FavoritesService',
      );
    } else {
      this.loggingService.debug(
        `Track already in favorites: ${id}`,
        'FavoritesService',
      );
    }

    const updated = await this.getOrCreateFavorites();
    return {
      artists: updated.favoriteArtists,
      albums: updated.favoriteAlbums,
      tracks: updated.favoriteTracks,
    };
  }

  async deleteTrackFromFavorites(id: string): Promise<void> {
    this.loggingService.log(
      `Removing track from favorites: ${id}`,
      'FavoritesService',
    );
    const track = await this.trackService.findById(id);

    if (!track) {
      this.loggingService.warn(
        `Track not found when removing from favorites: ${id}`,
        'FavoritesService',
      );
      throw new HttpException(ErrorMessage.TrackNotFound, HttpStatus.NOT_FOUND);
    }

    const favorites = await this.getOrCreateFavorites();
    const updatedTracks = favorites.favoriteTracks.filter(
      (trackId) => trackId !== id,
    );

    await this.prisma.favorites.update({
      where: { id: this.FAVORITES_ID },
      data: {
        favoriteTracks: updatedTracks,
      },
    });
    this.loggingService.log(
      `Track removed from favorites successfully: ${id}`,
      'FavoritesService',
    );
  }

  async addArtistToFavorites(id: string): Promise<Favorites> {
    this.loggingService.log(
      `Adding artist to favorites: ${id}`,
      'FavoritesService',
    );
    const artist = await this.artistService.findById(id);

    if (!artist) {
      this.loggingService.warn(
        `Artist not found when adding to favorites: ${id}`,
        'FavoritesService',
      );
      throw new HttpException(
        ErrorMessage.ArtistNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.favoriteArtists.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: this.FAVORITES_ID },
        data: {
          favoriteArtists: [...favorites.favoriteArtists, id],
        },
      });
      this.loggingService.log(
        `Artist added to favorites successfully: ${id}`,
        'FavoritesService',
      );
    } else {
      this.loggingService.debug(
        `Artist already in favorites: ${id}`,
        'FavoritesService',
      );
    }

    const updated = await this.getOrCreateFavorites();
    return {
      artists: updated.favoriteArtists,
      albums: updated.favoriteAlbums,
      tracks: updated.favoriteTracks,
    };
  }

  async deleteArtistFromFavorites(id: string): Promise<void> {
    this.loggingService.log(
      `Removing artist from favorites: ${id}`,
      'FavoritesService',
    );
    const artist = await this.artistService.findById(id);

    if (!artist) {
      this.loggingService.warn(
        `Artist not found when removing from favorites: ${id}`,
        'FavoritesService',
      );
      throw new HttpException(
        ErrorMessage.ArtistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    const favorites = await this.getOrCreateFavorites();
    const updatedArtists = favorites.favoriteArtists.filter(
      (artistId) => artistId !== id,
    );

    await this.prisma.favorites.update({
      where: { id: this.FAVORITES_ID },
      data: {
        favoriteArtists: updatedArtists,
      },
    });
    this.loggingService.log(
      `Artist removed from favorites successfully: ${id}`,
      'FavoritesService',
    );
  }

  async addAlbumToFavorites(id: string): Promise<Favorites> {
    this.loggingService.log(
      `Adding album to favorites: ${id}`,
      'FavoritesService',
    );
    const album = await this.albumService.findById(id);

    if (!album) {
      this.loggingService.warn(
        `Album not found when adding to favorites: ${id}`,
        'FavoritesService',
      );
      throw new HttpException(
        ErrorMessage.AlbumNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.favoriteAlbums.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: this.FAVORITES_ID },
        data: {
          favoriteAlbums: [...favorites.favoriteAlbums, id],
        },
      });
      this.loggingService.log(
        `Album added to favorites successfully: ${id}`,
        'FavoritesService',
      );
    } else {
      this.loggingService.debug(
        `Album already in favorites: ${id}`,
        'FavoritesService',
      );
    }

    const updated = await this.getOrCreateFavorites();
    return {
      artists: updated.favoriteArtists,
      albums: updated.favoriteAlbums,
      tracks: updated.favoriteTracks,
    };
  }

  async deleteAlbumFromFavorites(id: string): Promise<void> {
    this.loggingService.log(
      `Removing album from favorites: ${id}`,
      'FavoritesService',
    );
    const album = await this.albumService.findById(id);

    if (!album) {
      this.loggingService.warn(
        `Album not found when removing from favorites: ${id}`,
        'FavoritesService',
      );
      throw new HttpException(ErrorMessage.AlbumNotFound, HttpStatus.NOT_FOUND);
    }

    const favorites = await this.getOrCreateFavorites();
    const updatedAlbums = favorites.favoriteAlbums.filter(
      (albumId) => albumId !== id,
    );

    await this.prisma.favorites.update({
      where: { id: this.FAVORITES_ID },
      data: {
        favoriteAlbums: updatedAlbums,
      },
    });
    this.loggingService.log(
      `Album removed from favorites successfully: ${id}`,
      'FavoritesService',
    );
  }
}
