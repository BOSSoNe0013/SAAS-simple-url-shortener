import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../src/domain/services/auth.service";
import { User } from "../src/domain/entities/user.entity";
import { AppConfigService } from "../src/config/services/config.service";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const mockJwtService: Partial<JwtService> = {
  sign: jest.fn(),
};

const mockConfigService: Partial<AppConfigService> = {
  jwtSecret: "test-secret",
};

const mockRepo = {
  findOne: jest.fn(),
};

describe("AuthService", () => {
  let service: AuthService;
  let repo: typeof mockRepo;
  let jwt: Partial<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AppConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get(getRepositoryToken(User));
    jwt = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validate", () => {
    it("returns user when credentials match", async () => {
      const user: User = {
        id: 1,
        username: "alice",
        passwordHash: "hashedpw",
        role: "user",
      } as any;
      repo.findOne.mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validate("alice", "plainpw");
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { username: "alice" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith("plainpw", "hashedpw");
      expect(result).toBe(user);
    });

    it("returns undefined when username not found", async () => {
      repo.findOne.mockResolvedValueOnce(undefined);
      const result = await service.validate("bob", "any");
      expect(result).toBeUndefined();
    });

    it("returns undefined when password does not match", async () => {
      const user: User = {
        id: 2,
        username: "carol",
        passwordHash: "hash",
        role: "user",
      } as any;
      repo.findOne.mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const result = await service.validate("carol", "wrong");
      expect(result).toBeUndefined();
    });
  });

  describe("login", () => {
    it("returns access token for valid credentials", async () => {
      const user: User = {
        id: 3,
        username: "dave",
        passwordHash: "hash",
        role: "admin",
      } as any;
      repo.findOne.mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (jwt.sign as jest.Mock).mockReturnValue("token123");

      const res = await service.login("dave", "pass");
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: user.id, username: user.username, role: user.role },
        { secret: mockConfigService.jwtSecret },
      );
      expect(res).toEqual({ accessToken: "token123" });
    });

    it("throws UnauthorizedException for invalid credentials", async () => {
      repo.findOne.mockResolvedValueOnce(undefined);
      await expect(service.login("eve", "nopass")).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
