import { Injectable } from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany();
    return tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artistId: track.artistId,
      albumId: track.albumId,
      duration: track.duration,
    }));
  }

  async findById(id: string): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
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
    const createdTrack = await this.prisma.track.create({
      data: {
        id: track.id,
        name: track.name,
        artistId: track.artistId,
        albumId: track.albumId,
        duration: track.duration,
      },
    });

    return {
      id: createdTrack.id,
      name: createdTrack.name,
      artistId: createdTrack.artistId,
      albumId: createdTrack.albumId,
      duration: createdTrack.duration,
    };
  }

  async update(id: string, track: Track): Promise<Track> {
    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: {
        name: track.name,
        artistId: track.artistId,
        albumId: track.albumId,
        duration: track.duration,
      },
    });

    return {
      id: updatedTrack.id,
      name: updatedTrack.name,
      artistId: updatedTrack.artistId,
      albumId: updatedTrack.albumId,
      duration: updatedTrack.duration,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.track.delete({
      where: { id },
    });
  }
}
