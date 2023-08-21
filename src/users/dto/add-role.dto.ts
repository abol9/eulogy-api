import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'اسم نقش' })
  @IsString({ message: 'باید یک رشته باشد' })
  readonly value: string;

  @ApiProperty({
    example: '4',
    description: 'شناسه کاربری برای صدور نقش برای او',
  })
  @IsNumber({}, { message: 'باید یک عدد باشد' })
  readonly userId: number;
}
