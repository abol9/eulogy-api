import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class CreateAlbumDto {
  @ApiProperty({example: "Sempiternal", description: "Название альбома"})
  @IsString({message: "باید یک رشته باشد"})
  readonly title: string;

  @ApiProperty({example: "photo.jpg", description: "Файл обложки"})
  @IsOptional()
  readonly image: string;

  @ApiProperty({example: 1, description: "مداح"})
  @IsOptional()
  readonly eulogerId: number;
}
