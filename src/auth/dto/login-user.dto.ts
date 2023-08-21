import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'user@outlook.com', description: 'صندوق پستی' })
  @IsString({ message: 'باید یک رشته باشد' })
  @IsEmail({}, { message: 'ایمیل نادرست' })
  readonly email: string;

  @ApiProperty({ example: '1234567', description: 'کلمه عبور' })
  @IsString({ message: 'باید یک رشته باشد' })
  @Length(4, 16, { message: 'نه کمتر از 4 و نه بیشتر از 16' })
  readonly password: string;
}
