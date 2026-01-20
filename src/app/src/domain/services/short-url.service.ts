import { Injectable } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { ShortUrl } from '../entities/short-url.entity';
import { CreateShortUrlDto } from '../dto/create-short-url.dto';
import { UpdateShortUrlDto } from '../dto/update-short-url.dto';
import { generateCode } from '../utils/code-generator';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShortUrlService {
  constructor(
    @InjectRepository(ShortUrl)
    private repo: Repository<ShortUrl>,
  ) {
  }
    
  async create(dto: CreateShortUrlDto): Promise<ShortUrl> {
    const code = await generateCode();
    const url = this.repo.create({
      code,
      targetUrl: dto.targetUrl,
      expiresAt: dto.expiresAt,
    });
    return this.repo.save(url);
  }
    
  async findAll(): Promise<ShortUrl[]> {
    return this.repo.find({ relations: ['clickRecords'] });
  }
    
  async findOne(code: string): Promise<ShortUrl|null> {
    return this.repo.findOne({ where: { code } });
  }
    
  async update(code: string, dto: UpdateShortUrlDto): Promise<ShortUrl|undefined> {
    const url = await this.findOne(code);
    if (!url) return undefined;
    Object.assign(url, dto);
    return this.repo.save(url);
  }
    
  async delete(code: string): Promise<boolean> {
    const res = await this.repo.delete({ code });
    return res.affected ? !!res.affected : false;
  }
}
