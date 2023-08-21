import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class GenerateTokensResponseDto {
    @ApiProperty({ example: 'dfsjfjds231.das123d.dasf234d', description: 'Refresh токен' })
    @IsString({ message: 'باید یک رشته باشد' })
    readonly refreshToken: string;

    @ApiProperty({ example: 'dfsjfjds231.das123d.dasf234d', description: 'Refresh токен' })
    @IsString({ message: 'باید یک رشته باشد' })
    readonly accessToken: string;
}