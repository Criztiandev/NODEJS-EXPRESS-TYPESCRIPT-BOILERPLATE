import jwt from "jsonwebtoken";

interface TokenResult<T> {
  payload: T | null;
  expired: boolean;
  valid: boolean;
}

class TokenUtils {
  generateToken<T extends object>(
    payload: T,
    expiresAt: string | number = "1d",
    secret: string = process.env.JWT_SECRET || ""
  ): string {
    if (!payload) {
      throw new Error("Payload is required");
    }
    if (!secret) {
      throw new Error("Secret is required");
    }

    return jwt.sign({ data: payload }, secret, {
      expiresIn: expiresAt,
    });
  }

  verifyToken<T>(
    token: string,
    secret: string = process.env.JWT_SECRET || ""
  ): TokenResult<T> {
    if (!token) return { payload: null, expired: false, valid: false };

    try {
      const decoded = jwt.verify(token, secret) as { data: T };
      return { payload: decoded.data, expired: false, valid: true };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { payload: null, expired: true, valid: false };
      }
      return { payload: null, expired: false, valid: false };
    }
  }

  decodeToken<T>(token: string): T | null {
    try {
      const decoded = jwt.decode(token) as { data: T } | null;
      return decoded?.data ?? null;
    } catch {
      return null;
    }
  }
}

export default new TokenUtils();
