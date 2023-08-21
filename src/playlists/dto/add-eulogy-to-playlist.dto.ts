import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class AddEulogyToPlaylistDto {
  @ApiProperty({example: "7", description: "آیدی لیست پخش"})
  @IsNumber({}, {message: "باید یک عدد باشد"})
  readonly playlistId: number;

  @ApiProperty({example: "3", description: "آیدی مداحی"})
  @IsNumber({}, {message: "باید یک عدد باشد"})
  readonly eulogyId: number;
}
