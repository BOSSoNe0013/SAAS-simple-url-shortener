import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwt: JwtService, 
    private config: ConfigService
  ) {}
  async validate(username: string, pass: string): Promise<boolean> {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) return false;
    return bcrypt.compare(pass, user.passwordHash);
  }
  async login(user: User): Promise<{accessToken: string}> {
    const payload = { username: user.username, sub: user.id };
    return { accessToken: this.jwt.sign(payload, { secret: this.config.get<string>('JWT_SECRET', 'secret_key') }) };
  }
}
