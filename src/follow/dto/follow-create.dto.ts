import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowCreateDto {
  @ApiProperty({ example: '4', description: 'Идентификатор на кого фоллоу' })
  @IsNumber({}, { message: 'باید یک عدد باشد' })
  readonly followId: number;
}
