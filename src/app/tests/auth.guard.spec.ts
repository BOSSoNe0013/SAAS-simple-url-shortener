import { UnauthorizedException, ExecutionContext } from "@nestjs/common";
import { JwtGuard } from "../src/domain/guards/jwt.guard";
import { AppConfigService } from "../src/config/services/config.service";
import { createJwtMock, testToken } from "./jwt.mock";

const createConfigMock = (overrides: Partial<AppConfigService> = {}) => {
  const defaults: Partial<AppConfigService> = {
    jwtSecret: "test-secret",
  };
  return {
    ...defaults,
    ...overrides,
  } as unknown as AppConfigService;
};

const createContext = (headers: Record<string, string>) => {
  const req: any = { headers };
  return {
    switchToHttp: () => ({
      getRequest: () => req,
    }),
  } as unknown as ExecutionContext;
};

describe("JwtGuard", () => {
  it("allows request when bearer token is valid", () => {
    const jwtMock = createJwtMock({ verifyReturn: { sub: "user" } });
    const guard = new JwtGuard(jwtMock, createConfigMock());
    const context = createContext({ authorization: `Bearer ${testToken}` });

    const result = guard.canActivate(context);
    expect(result).toBe(true);
    const req = context.switchToHttp().getRequest();
    expect(req.user).toEqual({ sub: "user" });
    expect(jwtMock.verify).toHaveBeenCalledWith(testToken, {
      secret: "test-secret",
    });
  });

  it("throws when missing Authorization header", () => {
    const guard = new JwtGuard(createJwtMock({}), createConfigMock());
    const context = createContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it("throws when token format is invalid", () => {
    const guard = new JwtGuard(createJwtMock({}), createConfigMock());
    const context = createContext({ authorization: "Token abcdef" });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it("throws when token verification fails", () => {
    const jwtMock = createJwtMock({ verifyThrows: true });
    const guard = new JwtGuard(jwtMock, createConfigMock());
    const context = createContext({ authorization: `Bearer ${testToken}` });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
