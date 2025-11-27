import { Injectable } from "@nestjs/common";
import { Album } from "./interfaces/album.interface";

@Injectable()
export class AlbumService {
  private albums: Map<string, Album> = new Map();

  async findAll(): Promise<Album[]> {
    return Array.from(this.albums.values());
  }

  async findById(id: string): Promise<Album> {
    return this.albums.get(id);
  }

  async create(album: Album): Promise<Album> {
    this.albums.set(album.id, album);
    return album;
  } 

  async update(id: string, album: Album): Promise<Album> {
    this.albums.set(id, album);
    return album;
  }

  async delete(id: string): Promise<void> {
    this.albums.delete(id);
  }
}
