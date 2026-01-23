import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ShortUrl } from "../entities/short-url.entity";
import { CreateShortUrlDto } from "../dto/create-short-url.dto";
import { UpdateShortUrlDto } from "../dto/update-short-url.dto";
import { Click } from "../entities/click.entity";
import { generateCode } from "../utils/code-generator";
import { InjectRepository } from "@nestjs/typeorm";
import { AppConfigService } from "../../config/services/config.service";

@Injectable()
export class ShortUrlService {
  // Rate limiting bucket map
  private readonly rateBuckets = new Map<
    string,
    { tokens: number; lastRefill: number }
  >();
  private readonly RATE_LIMIT_CAPACITY: number;
  private readonly RATE_LIMIT_WINDOW_MS: number;

  constructor(
    @InjectRepository(ShortUrl)
    private readonly shortUrlRepository: Repository<ShortUrl>,
    @InjectRepository(Click)
    private readonly clickRepository: Repository<Click>,
    private readonly config: AppConfigService,
  ) {
    this.RATE_LIMIT_CAPACITY = this.config.rateLimitCapacity;
    this.RATE_LIMIT_WINDOW_MS = this.config.rateLimitWindowMs;
  }

  private refillBucket(ip: string) {
    const bucket = this.rateBuckets.get(ip) || {
      tokens: this.RATE_LIMIT_CAPACITY,
      lastRefill: Date.now(),
    };
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

  async recordClick(shortUrlId: string, ipAddress: string): Promise<void> {
    const click = this.clickRepository.create({ shortUrlId, ipAddress });
    await this.clickRepository.save(click);
    await this.shortUrlRepository.increment({ id: shortUrlId }, "clicks", 1);
  }

  async create(dto: CreateShortUrlDto): Promise<ShortUrl> {
    let code: string;
    let exists: ShortUrl | undefined;
    do {
      code = await generateCode();
      exists = await this.shortUrlRepository.findOne({ where: { code } });
    } while (exists);
    const url = this.shortUrlRepository.create({
      code,
      targetUrl: dto.targetUrl,
      expiresAt: dto.expiresAt,
    });
    return this.shortUrlRepository.save(url);
  }

  async findAll(): Promise<ShortUrl[]> {
    return this.shortUrlRepository.find({ relations: ["clickRecords"] });
  }

  async findOne(code: string): Promise<ShortUrl | null> {
    return this.shortUrlRepository.findOne({ where: { code } });
  }

  async update(
    code: string,
    dto: UpdateShortUrlDto,
  ): Promise<ShortUrl | undefined> {
    const url = await this.findOne(code);
    if (!url) return undefined;
    Object.assign(url, dto);
    return this.shortUrlRepository.save(url);
  }

  async delete(code: string): Promise<boolean> {
    const res = await this.shortUrlRepository.delete({ code });
    return res.affected ? !!res.affected : false;
  }
}
