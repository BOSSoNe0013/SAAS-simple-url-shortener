import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AppConfigService } from '../../config/services/config.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async validate(username: string, pass: string): Promise<User | undefined> {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) return undefined;
    const matches = await bcrypt.compare(pass, user.passwordHash);
    return matches ? user : undefined;
  }

  async login(username: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.validate(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwt.sign(payload, { secret: this.config.jwtSecret });
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);
    this.logger.log(`Access Token: ${JSON.stringify(accessToken)}`, );
    return { accessToken };
  }
}
