import { Controller, Post, Body, Res, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';
import { GetUser } from '../decorators/user.decorator';
import { JwtGuard } from '../guards/jwt.guard';

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
  
  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@GetUser() user:any) {
    return { success: true };
  }
}
