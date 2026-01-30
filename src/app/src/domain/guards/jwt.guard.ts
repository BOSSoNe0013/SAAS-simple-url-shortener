import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/services/config.service';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(private readonly jwt: JwtService, private readonly config: AppConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Missing token');
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') throw new UnauthorizedException('Invalid token format');
    try {
      const payload = this.jwt.verify(token, { secret: this.config.jwtSecret });
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
