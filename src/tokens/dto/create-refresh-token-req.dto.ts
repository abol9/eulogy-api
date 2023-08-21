import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, Length} from "class-validator";

export class CreateRefreshTokenReqDto {
  @ApiProperty({
    example: 3,
    description: "شناسه کاربر برای توکن",
  })
  @IsNumber({}, {message: "باید یک عدد باشد"})
  readonly userId: number;

  @ApiProperty({
    example: "dfsjfjds231.das123d.dasf234d",
    description: "Refresh токен",
  })
  @IsString({message: "باید یک رشته باشد"})
  readonly refreshToken: string;
}
