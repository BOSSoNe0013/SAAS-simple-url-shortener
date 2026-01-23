/* istanbul ignore file */
// jwt.mock.ts
// Utility for generating test JWT tokens (if needed in future tests)
// Here we simply expose a placeholder token string that can be used in tests.

import { JwtService } from "@nestjs/jwt";

export const testToken = "test-jwt-token";
export const testSecret = "test-jwt-secret";

// In more advanced scenarios, you could generate a signed token using
// the jsonwebtoken package, but for the current guard tests we only need
// a string value because the JwtService is mocked.

export function createTestToken(payload: Record<string, any> = {}): string {
    const jwt = new JwtService({
      secret: testSecret,
      signOptions: { expiresIn: "60s" },
    });
    return jwt.sign(payload, { secret: testSecret });
}

// Simple mock implementations
export const createJwtMock = (opts: {
  verifyReturn?: any;
  verifyThrows?: boolean;
}) => {
  const verify = jest.fn();
  if (opts.verifyThrows) {
    verify.mockImplementationOnce(() => {
      throw new Error("invalid");
    });
  } else if (opts.verifyReturn !== undefined) {
    verify.mockReturnValue(opts.verifyReturn);
  }
  return {
    verify,
  } as unknown as JwtService;
};
