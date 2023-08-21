import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Shroud', description: 'نام کاربری' })
  @IsString({ message: 'باید یک رشته باشد' })
  @Length(2, 16, { message: 'نه کمتر از 2 و نه بیشتر از 16' })
  readonly username: string;

  @ApiProperty({ example: '1234567', description: 'کلمه عبور' })
  @IsString({ message: 'باید یک رشته باشد' })
  @Length(4, 16, { message: 'نه کمتر از 4 و نه بیشتر از 16' })
  readonly password: string;
}
