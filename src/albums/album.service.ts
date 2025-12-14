import { Injectable } from '@nestjs/common';
import { Album } from './interfaces/album.interface';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<Album[]> {
    this.loggingService.debug('Fetching all albums', 'AlbumService');
    const albums = await this.prisma.album.findMany();
    this.loggingService.verbose(
      `Found ${albums.length} albums`,
      'AlbumService',
    );
    return albums.map((album) => ({
      id: album.id,
      name: album.name,
      year: album.year,
      artistId: album.artistId,
    }));
  }

  async findById(id: string): Promise<Album | null> {
    this.loggingService.debug(`Fetching album with id: ${id}`, 'AlbumService');
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      this.loggingService.warn(
        `Album not found with id: ${id}`,
        'AlbumService',
      );
      return null;
    }

    return {
      id: album.id,
      name: album.name,
      year: album.year,
      artistId: album.artistId,
    };
  }

  async create(album: Album): Promise<Album> {
    this.loggingService.log(
      `Creating new album: ${album.name}`,
      'AlbumService',
    );
    try {
      const createdAlbum = await this.prisma.album.create({
        data: {
          id: album.id,
          name: album.name,
          year: album.year,
          artistId: album.artistId,
        },
      });

      this.loggingService.log(
        `Album created successfully: ${createdAlbum.id}`,
        'AlbumService',
      );
      return {
        id: createdAlbum.id,
        name: createdAlbum.name,
        year: createdAlbum.year,
        artistId: createdAlbum.artistId,
      };
    } catch (error) {
      this.loggingService.error(
        `Failed to create album: ${error instanceof Error ? error.message : String(error)}`,
        'AlbumService',
      );
      throw error;
    }
  }

  async update(id: string, album: Album): Promise<Album> {
    this.loggingService.log(`Updating album with id: ${id}`, 'AlbumService');
    try {
      const updatedAlbum = await this.prisma.album.update({
        where: { id },
        data: {
          name: album.name,
          year: album.year,
          artistId: album.artistId,
        },
      });

      this.loggingService.log(
        `Album updated successfully: ${updatedAlbum.id}`,
        'AlbumService',
      );
      return {
        id: updatedAlbum.id,
        name: updatedAlbum.name,
        year: updatedAlbum.year,
        artistId: updatedAlbum.artistId,
      };
    } catch (error) {
      this.loggingService.error(
        `Failed to update album: ${error instanceof Error ? error.message : String(error)}`,
        'AlbumService',
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    this.loggingService.log(`Deleting album with id: ${id}`, 'AlbumService');
    try {
      await this.prisma.album.delete({
        where: { id },
      });
      this.loggingService.log(
        `Album deleted successfully: ${id}`,
        'AlbumService',
      );
    } catch (error) {
      this.loggingService.error(
        `Failed to delete album: ${error instanceof Error ? error.message : String(error)}`,
        'AlbumService',
      );
      throw error;
    }
  }
}
