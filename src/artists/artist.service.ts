import { Injectable } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany();
    return artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    }));
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      return null;
    }

    return {
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    };
  }

  async create(artist: Artist): Promise<Artist> {
    const createdArtist = await this.prisma.artist.create({
      data: {
        id: artist.id,
        name: artist.name,
        grammy: artist.grammy,
      },
    });

    return {
      id: createdArtist.id,
      name: createdArtist.name,
      grammy: createdArtist.grammy,
    };
  }

  async update(id: string, artist: Artist): Promise<Artist> {
    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: {
        name: artist.name,
        grammy: artist.grammy,
      },
    });

    return {
      id: updatedArtist.id,
      name: updatedArtist.name,
      grammy: updatedArtist.grammy,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.artist.delete({
      where: { id },
    });
  }
}
