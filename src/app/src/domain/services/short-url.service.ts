import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ShortUrl } from "../entities/short-url.entity";
import { CreateShortUrlDto } from "../dto/create-short-url.dto";
import { UpdateShortUrlDto } from "../dto/update-short-url.dto";
import { generateCode } from "../utils/code-generator";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ShortUrlService {
  // Rate limiting bucket map
  private readonly rateBuckets = new Map<
    string,
    { tokens: number; lastRefill: number }
  >();
  private readonly RATE_LIMIT_CAPACITY = 60;
  private readonly RATE_LIMIT_WINDOW_MS = 60_000;

  constructor(
    @InjectRepository(ShortUrl)
    private readonly repo: Repository<ShortUrl>,
  ) {}

  private refillBucket(ip: string) {
    const bucket = this.rateBuckets.get(ip) || { tokens: this.RATE_LIMIT_CAPACITY, lastRefill: Date.now() };
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;
    if (elapsed > this.RATE_LIMIT_WINDOW_MS) {
      bucket.tokens = this.RATE_LIMIT_CAPACITY;
      bucket.lastRefill = now;
    }
    return bucket;
  }

  public isAllowed(ip: string): boolean {
    const bucket = this.refillBucket(ip);
    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      this.rateBuckets.set(ip, bucket);
      return true;
    }
    return false;
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
    return this.repo.find({ relations: ["clickRecords"] });
  }

  async findOne(code: string): Promise<ShortUrl | null> {
    return this.repo.findOne({ where: { code } });
  }

  async update(
    code: string,
    dto: UpdateShortUrlDto,
  ): Promise<ShortUrl | undefined> {
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
