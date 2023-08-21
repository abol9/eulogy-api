import { ApiProperty } from '@nestjs/swagger';
import {IsObject, IsString, Length} from 'class-validator';

class UserInfoResponseDto {
    @ApiProperty({ example: 'admin@mail.ru', description: 'Почтовый адрес' })
    @IsString({ message: 'باید یک رشته باشد' })
    readonly email: string;
}

export class RegisterUserResponseDto {
    @ApiProperty({ example: UserInfoResponseDto, description: 'Данные пользователя', type: UserInfoResponseDto })
    readonly user: UserInfoResponseDto;

    @ApiProperty({ example: 'dasfsdaf.dasdas.dasf23q1', description: 'accessToken' })
    @IsString({ message: 'باید یک رشته باشد' })
    readonly accessToken: string;

    @ApiProperty({ example: 'dasf213412d.das12das.21312das', description: 'refreshToken' })
    @IsString({ message: 'باید یک رشته باشد' })
    readonly refreshToken: string;
}
