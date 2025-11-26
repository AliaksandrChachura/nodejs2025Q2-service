import { Injectable } from "@nestjs/common";
import { Artist } from "./interfaces/artist.interface"

@Injectable()
export class ArtistService {
    private artists: Map<string, Artist> = new Map();

    async findAll(): Promise<Artist[]> {
        return Array.from(this.artists.values())
    }

    async findById(id: string): Promise<Artist> {
        return this.artists.get(id);
    }

    async create(artist: Artist): Promise<Artist> {
        this.artists.set(artist.id, artist);
        return artist;
    }

    async update(id: string, artist: Artist): Promise<Artist> {
        this.artists.set(artist.id, artist)
        return artist;
    }

    async delete(id: string): Promise<void> {
        this.artists.delete(id);
    }
}