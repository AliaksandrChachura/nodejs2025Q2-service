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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlbumResponseDto } from './dto/album-response.dto';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: [AlbumResponseDto],
  })
  @Header('Accept', 'application/json')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: AlbumResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.AlbumNotFound,
  })
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
  @ApiOperation({ summary: 'Create album' })
  @ApiResponse({
    status: 201,
    description: 'Successful operation',
    type: AlbumResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestBody,
  })
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
  @ApiOperation({ summary: 'Update album' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: AlbumResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestBody,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.AlbumNotFound,
  })
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
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({
    status: 204,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.AlbumNotFound,
  })
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
