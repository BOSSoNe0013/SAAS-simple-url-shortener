import { IsUrl, IsString, IsOptional, IsDate } from 'class-validator';
export class CreateShortUrlDto {
  @IsUrl()
  targetUrl!: string;
  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}
