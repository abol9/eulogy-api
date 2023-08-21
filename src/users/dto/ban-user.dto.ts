import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class BanUserDto {
  @ApiProperty({
    example: 3,
    description: 'شناسه کاربری برای ممنوع کردن',
  })
  @IsNumber({}, { message: 'باید یک عدد باشد' })
  readonly userId: number;

  @ApiProperty({ example: 'هولیگانیسم', description: 'دلیل ممنوعیت' })
  @IsString({ message: 'باید یک رشته باشد' })
  @Length(3, 40, { message: 'نه کمتر از 3 و نه بیشتر از 40' })
  readonly banReason: string;
}
