import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ShortUrlService } from "../src/domain/services/short-url.service";
import { Repository } from "typeorm";
import { ShortUrl } from "../src/domain/entities/short-url.entity";
import { Click } from "../src/domain/entities/click.entity";
import { CreateShortUrlDto } from "../src/domain/dto/create-short-url.dto";
import { UpdateShortUrlDto } from "../src/domain/dto/update-short-url.dto";
import { AppConfigService } from "../src/config/services/config.service";

// Mock generateCode to return deterministic values
jest.mock("nanoid", () => ({
  customAlphabet: () => () => "ABC123"
}));

describe("ShortUrlService", () => {
  let service: ShortUrlService;
  let shortUrlRepo: Repository<ShortUrl>;
  let clickRepo: Repository<Click>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          ShortUrlService,
          {
            provide: getRepositoryToken(ShortUrl),
            useValue: {
              findOne: jest.fn(),
              create: jest.fn(),
              save: jest.fn(),
              find: jest.fn(),
              delete: jest.fn(),
              increment: jest.fn(),
            },
          },
          {
            provide: getRepositoryToken(Click),
            useValue: { create: jest.fn(), save: jest.fn() },
          },
          {
            provide: AppConfigService,
            useValue: {
              rateLimitCapacity: 60,
              rateLimitWindowMs: 60000,
            },
          },
        ],
    }).compile();

    service = module.get<ShortUrlService>(ShortUrlService);
    shortUrlRepo = module.get<Repository<ShortUrl>>(
      getRepositoryToken(ShortUrl),
    );
    clickRepo = module.get<Repository<Click>>(getRepositoryToken(Click));
  });

  it("creates a new short URL with unique code", async () => {
    (shortUrlRepo.findOne as jest.Mock).mockResolvedValue(undefined);
    (shortUrlRepo.create as jest.Mock).mockImplementation((e: any) => ({
      ...e,
    }));
    (shortUrlRepo.save as jest.Mock).mockImplementation((e: any) => ({
      id: "aaabbbccc",
      ...e,
    }));
    const dto: CreateShortUrlDto = {
      targetUrl: "https://example.com",
      expiresAt: undefined,
    };
    const result = await service.create(dto);
    expect(shortUrlRepo.findOne).toHaveBeenCalledWith({
      where: { code: "ABC123" },
    });
    expect(result).toMatchObject({ code: "ABC123", targetUrl: dto.targetUrl });
    expect(shortUrlRepo.save).toHaveBeenCalled();
  });

  it("finds all short URLs", async () => {
    const entities: ShortUrl[] = [
      {
        id: "aaabbbccc",
        code: "A",
        targetUrl: "x",
        clicks: 0,
        createdAt: new Date(),
        expiresAt: undefined,
        clickRecords: [],
      } as any,
      {
        id: "bbbcccddd",
        code: "B",
        targetUrl: "y",
        clicks: 0,
        createdAt: new Date(),
        expiresAt: undefined,
        clickRecords: [],
      } as any,
    ];
    (shortUrlRepo.find as jest.Mock).mockResolvedValue(entities);
    const result = await service.findAll();
    expect(shortUrlRepo.find).toHaveBeenCalledWith({
      relations: ["clickRecords"],
    });
    expect(result).toBe(entities);
  });

  it("finds one by code", async () => {
    const entity: ShortUrl = {
      id: "aaabbbccc",
      code: "XYZ",
      targetUrl: "x",
      clicks: 0,
      createdAt: new Date(),
      expiresAt: undefined,
      clickRecords: [],
    } as any;
    (shortUrlRepo.findOne as jest.Mock).mockResolvedValue(entity);
    const result = await service.findOne("XYZ");
    expect(shortUrlRepo.findOne).toHaveBeenCalledWith({
      where: { code: "XYZ" },
    });
    expect(result).toBe(entity);
  });

  it("updates an existing URL", async () => {
    const existing: ShortUrl = {
      id: "aaabbbccc",
      code: "XYZ",
      targetUrl: "x",
      clicks: 0,
      createdAt: new Date(),
      expiresAt: undefined,
      clickRecords: [],
    } as any;
    const dto: UpdateShortUrlDto = { clicks: 1, expiresAt: undefined };
    (shortUrlRepo.findOne as jest.Mock).mockResolvedValue(existing);
    (shortUrlRepo.save as jest.Mock).mockImplementation((e: any) => e);
    const result = await service.update("XYZ", dto);
    expect(result).toBe(existing);
    expect(existing).toMatchObject(dto);
    expect(shortUrlRepo.save).toHaveBeenCalledWith(existing);
  });

  it("returns undefined when updating non‑existent URL", async () => {
    (shortUrlRepo.findOne as jest.Mock).mockResolvedValue(undefined);
    const result = await service.update("NON", {
      clicks: 1,
      expiresAt: undefined,
    } as any);
    expect(result).toBeUndefined();
  });

  it("deletes a URL and returns boolean", async () => {
    (shortUrlRepo.delete as jest.Mock).mockResolvedValue({
      affected: 1,
    } as any);
    const res = await service.delete("XYZ");
    expect(res).toBe(true);
    expect(shortUrlRepo.delete).toHaveBeenCalledWith({ code: "XYZ" });
    (shortUrlRepo.delete as jest.Mock).mockResolvedValue({
      affected: 0,
    } as any);
    const res2 = await service.delete("XYZ");
    expect(res2).toBe(false);
  });

  it("records a click and increments counter", async () => {
    const clickObj = { shortUrlId: "ABC", ipAddress: "1.2.3.4" } as any;
    (clickRepo.create as jest.Mock).mockReturnValue(clickObj);
    (clickRepo.save as jest.Mock).mockResolvedValue(clickObj);
    (shortUrlRepo.increment as jest.Mock).mockResolvedValue(undefined);
    await service.recordClick("ABC", "1.2.3.4");
    expect(clickRepo.create).toHaveBeenCalledWith({
      shortUrlId: "ABC",
      ipAddress: "1.2.3.4",
    });
    expect(clickRepo.save).toHaveBeenCalledWith(clickObj);
    expect(shortUrlRepo.increment).toHaveBeenCalledWith({ id: "ABC" }, "clicks", 1);
  });

  it("rate limiting allows up to capacity requests", () => {
    const ip = "127.0.0.1";
    for (let i = 0; i < 60; i++) {
      expect(service.isAllowed(ip)).toBe(true);
    }
    expect(service.isAllowed(ip)).toBe(false);
  });

  it("refills bucket after window", () => {
    const ip = "127.0.0.1";
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now + 61_000);
    expect(service.isAllowed(ip)).toBe(true);
    jest.spyOn(Date, "now").mockRestore();
  });
});
