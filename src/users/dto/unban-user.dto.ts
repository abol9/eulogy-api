import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UnbanUserDto {
  @ApiProperty({
    example: 3,
    description: 'شناسه کاربر برای ممنوع نشدن',
  })
  @IsNumber({}, { message: 'باید یک عدد باشد' })
  readonly userId: number;
}
