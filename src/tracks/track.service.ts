import { Injectable } from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<Track[]> {
    this.loggingService.debug('Fetching all tracks', 'TrackService');
    const tracks = await this.prisma.track.findMany();
    this.loggingService.verbose(
      `Found ${tracks.length} tracks`,
      'TrackService',
    );
    return tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artistId: track.artistId,
      albumId: track.albumId,
      duration: track.duration,
    }));
  }

  async findById(id: string): Promise<Track | null> {
    this.loggingService.debug(`Fetching track with id: ${id}`, 'TrackService');
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      this.loggingService.warn(
        `Track not found with id: ${id}`,
        'TrackService',
      );
      return null;
    }

    return {
      id: track.id,
      name: track.name,
      artistId: track.artistId,
      albumId: track.albumId,
      duration: track.duration,
    };
  }

  async create(track: Track): Promise<Track> {
    this.loggingService.log(
      `Creating new track: ${track.name}`,
      'TrackService',
    );
    try {
      const createdTrack = await this.prisma.track.create({
        data: {
          id: track.id,
          name: track.name,
          artistId: track.artistId,
          albumId: track.albumId,
          duration: track.duration,
        },
      });

      this.loggingService.log(
        `Track created successfully: ${createdTrack.id}`,
        'TrackService',
      );
      return {
        id: createdTrack.id,
        name: createdTrack.name,
        artistId: createdTrack.artistId,
        albumId: createdTrack.albumId,
        duration: createdTrack.duration,
      };
    } catch (error) {
      this.loggingService.error(
        `Failed to create track: ${error instanceof Error ? error.message : String(error)}`,
        'TrackService',
      );
      throw error;
    }
  }

  async update(id: string, track: Track): Promise<Track> {
    this.loggingService.log(`Updating track with id: ${id}`, 'TrackService');
    try {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: {
          name: track.name,
          artistId: track.artistId,
          albumId: track.albumId,
          duration: track.duration,
        },
      });

      this.loggingService.log(
        `Track updated successfully: ${updatedTrack.id}`,
        'TrackService',
      );
      return {
        id: updatedTrack.id,
        name: updatedTrack.name,
        artistId: updatedTrack.artistId,
        albumId: updatedTrack.albumId,
        duration: updatedTrack.duration,
      };
    } catch (error) {
      this.loggingService.error(
        `Failed to update track: ${error instanceof Error ? error.message : String(error)}`,
        'TrackService',
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    this.loggingService.log(`Deleting track with id: ${id}`, 'TrackService');
    try {
      await this.prisma.track.delete({
        where: { id },
      });
      this.loggingService.log(
        `Track deleted successfully: ${id}`,
        'TrackService',
      );
    } catch (error) {
      this.loggingService.error(
        `Failed to delete track: ${error instanceof Error ? error.message : String(error)}`,
        'TrackService',
      );
      throw error;
    }
  }
}
