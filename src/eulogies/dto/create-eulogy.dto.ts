import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, Length} from "class-validator";

export class CreateEulogyDto {
  @ApiProperty({example: "Drown", description: "نام آهنگ"})
  @IsString({message: "باید یک رشته باشد"})
  @Length(1, 100, {message: "نه کمتر از 1 و نه بیشتر از 100"})
  readonly title: string;

  @ApiProperty({
    example: 3,
    description: "آیدی آلبوم",
  })
  @IsNumber({}, {message: "باید یک عدد باشد"})
  readonly albumId: number;

  @ApiProperty({example: 6, description: "آیدی مداح آلبوم"})
  @IsNumber({}, {message: "باید یک عدد باشد"})
  readonly eulogerId: number;

  @ApiProperty({example: 300, description: "طول مداحی بر حسب ثانیه"})
  @IsNumber({}, {message: "باید یک عدد باشد"})
  readonly duration: number;
}
