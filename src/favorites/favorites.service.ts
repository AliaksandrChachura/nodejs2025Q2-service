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

@Injectable()
export class FavoritesService {
  private favorites: Map<string, Favorites> = new Map([
    ['favorites', { artists: [], albums: [], tracks: [] }],
  ]);
  constructor(
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}

  async findAll(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    const favorite = this.favorites.get('favorites') || {
      artists: [],
      albums: [],
      tracks: [],
    };

    const artistsResults = await Promise.all(
      favorite.artists.map((id) => this.artistService.findById(id)),
    );
    const artists = artistsResults.filter((artist) => artist !== undefined);

    const albumsResults = await Promise.all(
      favorite.albums.map((id) => this.albumService.findById(id)),
    );
    const albums = albumsResults.filter((album) => album !== undefined);

    const tracksResults = await Promise.all(
      favorite.tracks.map((id) => this.trackService.findById(id)),
    );
    const tracks = tracksResults.filter((track) => track !== undefined);
    console.log('tracks: ', tracks, 'artists: ', artists, 'albums: ', albums);
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

    const favorite = this.favorites.get('favorites');
    if (!favorite?.tracks.includes(id)) {
      favorite.tracks.push(id);
      this.favorites.set('favorites', favorite);
    }

    return favorite;
  }

  async deleteTrackFromFavorites(id: string): Promise<void> {
    const track = await this.trackService.findById(id);

    if (!track) {
      throw new HttpException(ErrorMessage.TrackNotFound, HttpStatus.NOT_FOUND);
    }

    const favorite = this.favorites.get('favorites');
    favorite.tracks = favorite.tracks.filter((track) => track !== id);
    this.favorites.set('favorites', favorite);
    return;
  }

  async addArtistToFavorites(id: string): Promise<Favorites> {
    const artist = await this.artistService.findById(id);

    if (!artist) {
      throw new HttpException(
        ErrorMessage.ArtistNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorite = this.favorites.get('favorites');
    if (!favorite?.artists.includes(id)) {
      favorite.artists.push(id);
      this.favorites.set('favorites', favorite);
    }

    return favorite;
  }

  async deleteArtistFromFavorites(id: string): Promise<void> {
    const artist = await this.artistService.findById(id);

    if (!artist) {
      throw new HttpException(
        ErrorMessage.ArtistNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    const favorite = this.favorites.get('favorites');
    favorite.artists = favorite.artists.filter((artistId) => artistId !== id);
    this.favorites.set('favorites', favorite);
    return;
  }

  async addAlbumToFavorites(id: string): Promise<Favorites> {
    const album = await this.albumService.findById(id);

    if (!album) {
      throw new HttpException(
        ErrorMessage.AlbumNotFound,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorite = this.favorites.get('favorites');
    if (!favorite?.albums.includes(id)) {
      favorite.albums.push(id);
      this.favorites.set('favorites', favorite);
    }

    return favorite;
  }

  async deleteAlbumFromFavorites(id: string): Promise<void> {
    const album = await this.albumService.findById(id);

    if (!album) {
      throw new HttpException(ErrorMessage.AlbumNotFound, HttpStatus.NOT_FOUND);
    }

    const favorite = this.favorites.get('favorites');
    favorite.albums = favorite.albums.filter((albumId) => albumId !== id);
    this.favorites.set('favorites', favorite);
    return;
  }
}
