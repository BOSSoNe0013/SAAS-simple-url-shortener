import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { ShortUrl } from "../entities/short-url.entity";
import { CreateShortUrlDto } from "../dto/create-short-url.dto";
import { UpdateShortUrlDto } from "../dto/update-short-url.dto";
import { Click } from "../entities/click.entity";
import { generateCode } from "../../utils/code-generator";
import { InjectRepository } from "@nestjs/typeorm";
import { AppConfigService } from "../../config/services/config.service";

@Injectable()
export class ShortUrlService {
  private readonly logger = new Logger(ShortUrlService.name);

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
    this.logger.log(`RATE_LIMIT_CAPACITY: ${this.RATE_LIMIT_CAPACITY}`);
    this.logger.log(`RATE_LIMIT_WINDOW_MS: ${this.RATE_LIMIT_WINDOW_MS}`);
    const bucket = this.rateBuckets.get(ip) || {
      tokens: this.RATE_LIMIT_CAPACITY,
      lastRefill: Date.now(),
    };
    this.logger.log(`${ip} -> tokens: ${bucket.tokens}`);
    this.logger.log(`${ip} -> last refill: ${bucket.lastRefill}`);
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

  async create(userId: string, dto: CreateShortUrlDto): Promise<ShortUrl> {
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
      ownerId: userId,
    });
    return this.shortUrlRepository.save(url);
  }

  async findAll(): Promise<ShortUrl[]> {
    return this.shortUrlRepository.find({ 
      relations: ["clickRecords"]
     });
  }

  async findAllForUser(userId: string): Promise<ShortUrl[]> {
    return this.shortUrlRepository.find({ 
      relations: ["clickRecords"],
      where: {
        ownerId: userId
      }
     });
  }

  async findOne(code: string): Promise<ShortUrl | null> {
    return this.shortUrlRepository.findOne({ 
      where: { 
        code,
      } 
    });
  }

  async findOneForUser(userId: string, code: string): Promise<ShortUrl | null> {
    return this.shortUrlRepository.findOne({ 
      where: { 
        code,
        ownerId: userId, 
      } 
    });
  }

  async update(
    userId: string, 
    code: string,
    dto: UpdateShortUrlDto,
  ): Promise<ShortUrl | undefined> {
    const url = await this.findOneForUser(userId, code);
    if (!url) return undefined;
    Object.assign(url, dto);
    return this.shortUrlRepository.save(url);
  }

  async delete(userId: string, code: string): Promise<boolean> {
    const res = await this.shortUrlRepository.delete({ 
      code,
      ownerId: userId, 
    });
    return res.affected ? !!res.affected : false;
  }
}
