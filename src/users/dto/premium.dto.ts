import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PremiumDto {
  @ApiProperty({ example: 4, description: 'شناسه کاربر' })
  @IsNumber({}, { message: 'باید یک رشته باشد' })
  readonly userId: number;
}
