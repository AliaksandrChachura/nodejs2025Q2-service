import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, HttpException, ParseUUIDPipe, Header } from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './interfaces/track.interface';
import { ErrorMessage } from '../helpers/constants';
import { generateUuid } from '../helpers/utils';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dts';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Track[]> {
    return await this.trackService.findAll();
  }

  @Get(':id')
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Omit<Track, 'artistId' | 'albumId'>> {
    const track = await this.trackService.findById(id);

    if (!track) {
      throw new HttpException(ErrorMessage.TrackNotFound, HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Post()
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    const createdTrack = await this.trackService.create({
      id: generateUuid(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
    });
    
    return createdTrack;
  }

  @Put(':id')
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTrackDto: UpdateTrackDto): Promise<Track> {
    const existingTrack = await this.trackService.findById(id);

    if (!existingTrack) {
      throw new HttpException(ErrorMessage.TrackNotFound, HttpStatus.NOT_FOUND);
    }

    return await this.trackService.update(id, {
      ...existingTrack,
      name: updateTrackDto.name,
      duration: updateTrackDto.duration,
      artistId: updateTrackDto.artistId ?? existingTrack.artistId ?? null,
      albumId: updateTrackDto.albumId ?? existingTrack.albumId ?? null,
    });
  }

  @Delete(':id')
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const existingTrack = await this.trackService.findById(id);

    if (!existingTrack) {
      throw new HttpException(ErrorMessage.TrackNotFound, HttpStatus.NOT_FOUND);
    }

    await this.trackService.delete(id);
  }
}