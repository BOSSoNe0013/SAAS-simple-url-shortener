import { Test } from "@nestjs/testing";
import { EntityTarget, Repository } from "typeorm";
import { UsersService } from "../src/domain/services/users.service";
import { AppConfigService } from "../src/config/services/config.service";
import * as bcrypt from "bcrypt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../src/domain/entities/user.entity";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

// Mock repository
const createMockRepository = () => {
  const mock: Partial<Repository<User>> = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  } as any as Repository<User>;
  return mock;
};

// Mock config service with default admin values
const createMockConfig = () => {
  return {
    defaultAdminAccount: "admin",
    defaultAdminPassword: "adminPassword",
  } as unknown as AppConfigService;
};

describe("UsersService", () => {
  let service: UsersService;
  let repo: Repository<User>;
  let config: AppConfigService;

  beforeEach(async () => {
    repo = createMockRepository() as Repository<User>;
    config = createMockConfig();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
        { provide: AppConfigService, useValue: config },
      ],
    }).compile();
    service = moduleRef.get<UsersService>(UsersService);
  });

  it("returns false if admin already exists", async () => {
    (repo.exists as jest.Mock).mockResolvedValueOnce(true);
    const result = await service.seed();
    expect(result).toBe(false);
  });

  it("creates admin account when not exists and returns true", async () => {
    (repo.exists as jest.Mock).mockResolvedValueOnce(false);
    (repo.create as jest.Mock).mockImplementation((e: any) => e);
    (repo.save as jest.Mock).mockResolvedValueOnce({
      id: 1,
      username: config.defaultAdminAccount,
    });
    // mock bcrypt.hash
    //jest.spyOn(bcrypt, "hash").mockImplementation(() => Promise.resolve("hashedPassword"));

    const result = await service.seed();
    expect(result).toBe(true);
    expect(repo.create).toHaveBeenCalledWith({
      username: config.defaultAdminAccount,
      passwordHash: "hashedPassword",
      role: "admin",
    });
    expect(repo.save).toHaveBeenCalled();
    expect((bcrypt.hash as any).mock.calls[0][0]).toBe(
      config.defaultAdminPassword,
    );
  });
});
