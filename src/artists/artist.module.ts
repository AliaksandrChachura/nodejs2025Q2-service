import { ArtistService } from "./artist.service";
import { ArtistController } from "./artist.controller";
import { Module } from "@nestjs/common";
import { TrackModule } from "../tracks/track.module";

@Module({
  imports: [TrackModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}