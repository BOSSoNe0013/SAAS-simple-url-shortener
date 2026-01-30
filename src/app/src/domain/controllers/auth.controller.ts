import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { accessToken } = await this.authService.login(dto.username, dto.password);
    return res
      .status(HttpStatus.OK)
      .setHeader('Authorization', accessToken)
      .json({ accessToken });
  }
}
