import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsOptional, IsString, Length} from "class-validator";

export class CreateUserDto {
  @ApiProperty({example: "user@outlook.com", description: "ایمیل"})
  @IsString({message: "باید یک رشته باشد"})
  @IsEmail({}, {message: "Некорректный email"})
  readonly email: string;

  @ApiProperty({example: "hash(1234567)", description: "کلمه عبور"})
  @IsString({message: "باید یک رشته باشد"})
  @Length(4, 16, {message: "نه کمتر از 4 و نه بیشتر از 16"})
  readonly password: string;

  @ApiProperty({example: "Shroud", description: "نام کاربری"})
  @IsString({message: "باید یک رشته باشد"})
  @Length(2, 16, {message: "نه کمتر از 2 و نه بیشتر از 16"})
  readonly username: string;
}

export class CreateUserLinkDto extends CreateUserDto {
  @ApiProperty({
    example: "/auth/activate/cd2312-das-312",
    description: "لینک فعال سازی اکانت",
  })
  @IsString({message: "باید یک رشته باشد"})
  @IsOptional()
  readonly activationLink: string;
}
