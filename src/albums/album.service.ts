import { Injectable } from '@nestjs/common';
import { Album } from './interfaces/album.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    const albums = await this.prisma.album.findMany();
    return albums.map((album) => ({
      id: album.id,
      name: album.name,
      year: album.year,
      artistId: album.artistId,
    }));
  }

  async findById(id: string): Promise<Album | null> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
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
    const createdAlbum = await this.prisma.album.create({
      data: {
        id: album.id,
        name: album.name,
        year: album.year,
        artistId: album.artistId,
      },
    });

    return {
      id: createdAlbum.id,
      name: createdAlbum.name,
      year: createdAlbum.year,
      artistId: createdAlbum.artistId,
    };
  }

  async update(id: string, album: Album): Promise<Album> {
    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: {
        name: album.name,
        year: album.year,
        artistId: album.artistId,
      },
    });

    return {
      id: updatedAlbum.id,
      name: updatedAlbum.name,
      year: updatedAlbum.year,
      artistId: updatedAlbum.artistId,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.album.delete({
      where: { id },
    });
  }
}
