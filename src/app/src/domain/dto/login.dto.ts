import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password!: string;
}
