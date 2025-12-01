import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  HttpException,
  ParseUUIDPipe,
  Param,
  Put,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { Album } from './interfaces/album.interface';
import { ErrorMessage } from '../helpers/constants';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { generateUuid } from '../helpers/utils';
import { TrackService } from '../tracks/track.service';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @Get()
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Album> {
    const album = await this.albumService.findById(id);

    if (!album) {
      throw new HttpException(ErrorMessage.AlbumNotFound, HttpStatus.NOT_FOUND);
    }
    return album;
  }

  @Post()
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = await this.albumService.create({
      id: generateUuid(),
      name: createAlbumDto.name,
      year: createAlbumDto.year ?? null,
      artistId: createAlbumDto.artistId ?? null,
    });

    if (!album) {
      throw new HttpException(
        ErrorMessage.InvalidRequestBody,
        HttpStatus.BAD_REQUEST,
      );
    }
    return album;
  }

  @Put(':id')
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const existingAlbum = await this.albumService.findById(id);

    if (!existingAlbum) {
      throw new HttpException(ErrorMessage.AlbumNotFound, HttpStatus.NOT_FOUND);
    }
    const album = await this.albumService.update(id, {
      id: id,
      name: updateAlbumDto.name,
      year: updateAlbumDto.year ?? null,
      artistId: updateAlbumDto.artistId ?? null,
    });

    return album;
  }

  @Delete(':id')
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const existingAlbum = await this.albumService.findById(id);

    if (!existingAlbum) {
      throw new HttpException(ErrorMessage.AlbumNotFound, HttpStatus.NOT_FOUND);
    }
    const tracks = await this.trackService.findAll();
    const tracksToUpdate = tracks.filter((track) => track.albumId === id);

    await Promise.all(
      tracksToUpdate.map((track) =>
        this.trackService.update(track.id, {
          ...track,
          albumId: null,
        }),
      ),
    );

    await this.albumService.delete(id);
  }
}
