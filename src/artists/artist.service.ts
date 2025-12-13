import { Injectable } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<Artist[]> {
    this.loggingService.debug('Fetching all artists', 'ArtistService');
    const artists = await this.prisma.artist.findMany();
    this.loggingService.verbose(`Found ${artists.length} artists`, 'ArtistService');
    return artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    }));
  }

  async findById(id: string): Promise<Artist | null> {
    this.loggingService.debug(`Fetching artist with id: ${id}`, 'ArtistService');
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      this.loggingService.warn(`Artist not found with id: ${id}`, 'ArtistService');
      return null;
    }

    return {
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    };
  }

  async create(artist: Artist): Promise<Artist> {
    this.loggingService.log(`Creating new artist: ${artist.name}`, 'ArtistService');
    try {
      const createdArtist = await this.prisma.artist.create({
        data: {
          id: artist.id,
          name: artist.name,
          grammy: artist.grammy,
        },
      });

      this.loggingService.log(
        `Artist created successfully: ${createdArtist.id}`,
        'ArtistService',
      );
      return {
        id: createdArtist.id,
        name: createdArtist.name,
        grammy: createdArtist.grammy,
      };
    } catch (error) {
      this.loggingService.error(
        `Failed to create artist: ${error instanceof Error ? error.message : String(error)}`,
        'ArtistService',
      );
      throw error;
    }
  }

  async update(id: string, artist: Artist): Promise<Artist> {
    this.loggingService.log(`Updating artist with id: ${id}`, 'ArtistService');
    try {
      const updatedArtist = await this.prisma.artist.update({
        where: { id },
        data: {
          name: artist.name,
          grammy: artist.grammy,
        },
      });

      this.loggingService.log(
        `Artist updated successfully: ${updatedArtist.id}`,
        'ArtistService',
      );
      return {
        id: updatedArtist.id,
        name: updatedArtist.name,
        grammy: updatedArtist.grammy,
      };
    } catch (error) {
      this.loggingService.error(
        `Failed to update artist: ${error instanceof Error ? error.message : String(error)}`,
        'ArtistService',
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    this.loggingService.log(`Deleting artist with id: ${id}`, 'ArtistService');
    try {
      await this.prisma.artist.delete({
        where: { id },
      });
      this.loggingService.log(
        `Artist deleted successfully: ${id}`,
        'ArtistService',
      );
    } catch (error) {
      this.loggingService.error(
        `Failed to delete artist: ${error instanceof Error ? error.message : String(error)}`,
        'ArtistService',
      );
      throw error;
    }
  }
}
