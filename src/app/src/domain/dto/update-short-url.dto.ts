import { IsOptional, IsNumber, IsDate } from 'class-validator';
export class UpdateShortUrlDto {
  @IsOptional()
  @IsNumber()
  clicks?: number;
  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}
