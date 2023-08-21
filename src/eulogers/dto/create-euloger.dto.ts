import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEulogerDto {
  @ApiProperty({ example: 'Bad Omens', description: 'نام مداح' })
  @IsString({ message: 'نام مداح باید رشته باشد' })
  @Length(2, 50, {
    message: 'نام مداح باید بیش از 2 کاراکتر و کمتر از 50 کاراکتر باشد.',
  })
  readonly name: string;

  @ApiProperty({ example: 'photo.jpg', description: 'عکس مداح' })
  @IsOptional()
  readonly image: string;
}
