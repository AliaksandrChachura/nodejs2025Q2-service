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

@Injectable()
export class FavoritesService {
  private readonly FAVORITES_ID = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
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

    return { artists, albums, tracks };
  }

  async addTrackToFavorites(id: string): Promise<Favorites> {
    const track = await this.trackService.findById(id);

    if (!track) {
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
    }

    const updated = await this.getOrCreateFavorites();
    return {
      artists: updated.favoriteArtists,
      albums: updated.favoriteAlbums,
      tracks: updated.favoriteTracks,
    };
  }

  async deleteTrackFromFavorites(id: string): Promise<void> {
    const track = await this.trackService.findById(id);

    if (!track) {
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
  }

  async addArtistToFavorites(id: string): Promise<Favorites> {
    const artist = await this.artistService.findById(id);

    if (!artist) {
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
    }

    const updated = await this.getOrCreateFavorites();
    return {
      artists: updated.favoriteArtists,
      albums: updated.favoriteAlbums,
      tracks: updated.favoriteTracks,
    };
  }

  async deleteArtistFromFavorites(id: string): Promise<void> {
    const artist = await this.artistService.findById(id);

    if (!artist) {
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
  }

  async addAlbumToFavorites(id: string): Promise<Favorites> {
    const album = await this.albumService.findById(id);

    if (!album) {
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
    }

    const updated = await this.getOrCreateFavorites();
    return {
      artists: updated.favoriteArtists,
      albums: updated.favoriteAlbums,
      tracks: updated.favoriteTracks,
    };
  }

  async deleteAlbumFromFavorites(id: string): Promise<void> {
    const album = await this.albumService.findById(id);

    if (!album) {
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
  }
}
