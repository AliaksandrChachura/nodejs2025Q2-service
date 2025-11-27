import { Controller, Get, Header, HttpCode, HttpStatus, HttpException, ParseUUIDPipe, Param, Put, Post, Body, Delete } from '@nestjs/common'
import { Artist } from "./interfaces/artist.interface"
import { ErrorMessage } from "../helpers/constants"
import { ArtistService } from "./artist.service"
import { TrackService } from "../tracks/track.service"
import { AlbumService } from "../albums/album.service"
import { CreateArtistDto } from "./dto/create-artist.dto"
import { UpdateArtistDto } from "./dto/update-artist.dto"
import { generateUuid } from "../helpers/utils"


@Controller('artist')
export class ArtistController {
    constructor (private readonly artistService: ArtistService, private readonly trackService: TrackService, private readonly albumService: AlbumService) {}

    @Get()
    @Header('Accept', 'application/json')
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return this.artistService.findAll()
    }

    @Get(':id')
    @Header('Accept', 'application/json')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Artist> {
        const artist = await this.artistService.findById(id);

        if (!artist) {
            throw new HttpException(ErrorMessage.ArtistNotFound, HttpStatus.NOT_FOUND);
        }
        return artist;
    }

    @Post()
    @Header('Accept', 'application/json')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
        return this.artistService.create({
            id: generateUuid(),
            name: createArtistDto.name,
            grammy: createArtistDto.grammy,
        });
    }
    
    @Put(':id')
    @Header('Accept', 'application/json')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateArtistDto: UpdateArtistDto): Promise<Artist> {
        const existingArtist = await this.artistService.findById(id);

        if (!existingArtist) {
            throw new HttpException(ErrorMessage.ArtistNotFound, HttpStatus.NOT_FOUND);
        }

        return this.artistService.update(id, {
            id: id,
            name: updateArtistDto.name,
            grammy: updateArtistDto.grammy,
        });
    }

    @Delete(':id')
    @Header('Accept', 'application/json')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        const existingArtist = await this.artistService.findById(id);

        if (!existingArtist) {
            throw new HttpException(ErrorMessage.ArtistNotFound, HttpStatus.NOT_FOUND);
        }

        const tracks = await this.trackService.findAll();
        const tracksToUpdate = tracks.filter(track => track.artistId === id);
        
        await Promise.all(
            tracksToUpdate.map(track =>
                this.trackService.update(track.id, {
                    ...track,
                    artistId: null,
                })
            )
        );

        const albums = await this.albumService.findAll();
        const albumsToUpdate = albums.filter(album => album.artistId === id);
        
        await Promise.all(
            albumsToUpdate.map(album =>
                this.albumService.update(album.id, {
                    ...album,
                    artistId: null,
                })
            )
        );

        await this.artistService.delete(id);
    }

}
