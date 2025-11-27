import { IsNotEmpty, IsNumber, IsString, IsOptional, ValidateIf, IsUUID } from "class-validator";

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  @ValidateIf((o, value) => value !== null)
  @IsUUID()
  artistId?: string | null;
}