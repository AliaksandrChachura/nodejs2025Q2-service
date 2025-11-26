import { Injectable } from '@nestjs/common';
import Track from './interfaces/track.interface';

@Injectable()
export class TrackService {
  private tracks: Map<string, Track> = new Map();

  async findAll(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async findById(id: string): Promise<Track> {
    return this.tracks.get(id);
  }

  async create(track: Track): Promise<Track> {
    this.tracks.set(track.id, track);
    return track;
  }

  async update(id: string, track: Track): Promise<Track> {
    this.tracks.set(id, track);
    return track;
  }

  async delete(id: string): Promise<void> {
    this.tracks.delete(id);
  }
}