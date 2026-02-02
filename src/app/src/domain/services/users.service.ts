import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository, TypeOrmDataSourceFactory, TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { AppConfigService } from "../../config/services/config.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly config: AppConfigService,
  ) {}

  async seed(): Promise<Boolean> {
    const username = this.config.defaultAdminAccount;
    const exists = await this.repo.exists({
      where: {
        username
      }
    })
    if (exists) return false;
    const password = this.config.defaultAdminPassword;
    const passwordHash = await bcrypt.hash(password, 12);
    const account = this.repo.create({
      username,
      passwordHash,
      role: 'admin'
    });
    const result = await this.repo.save(account);
    if (!result) return false;
    return true;
  }

  async findById(userId: string): Promise<User> {
    return await this.repo.findOne({
      where: {
        id: userId
      }
    });
  }

}
