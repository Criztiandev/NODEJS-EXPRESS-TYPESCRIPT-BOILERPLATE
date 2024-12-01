import jwt from "jsonwebtoken";

class TokenUtils {
  constructor() {}

  generateToken<T extends object>(
    payload: T,
    expiresAt: string | number = "1d",
    secret: string = process.env.JWT_SECRET || ""
  ): string {
    if (!payload || !secret)
      throw new Error("Please provide all required parameters");
    return jwt.sign({ data: payload }, secret, {
      expiresIn: expiresAt,
    });
  }

  verifyToken(
    token: string,
    secret: string = process.env.JWT_SECRET || ""
  ): { payload: any[] | null; expired: boolean } {
    try {
      const decoded = jwt.verify(token, secret, {
        ignoreExpiration: false,
      }) as { data: any[] };

      return { payload: decoded.data, expired: false };
    } catch (e) {
      return { payload: null, expired: true };
    }
  }
}

export default new TokenUtils();

// export default {
//   generateSecret: async () => {},
//   generateToken: (payload, expiresAt, secret = process.env.JWT_SECRET) => {
//     if (!payload || !secret)
//       throw new Error("Please provide all required parameter");
//     return jwt.sign(payload, secret, {
//       expiresIn: expiresAt || "1d",
//     });
//   },
//   verifyToken: async (token, secret = process.env.JWT_SECRET) => {
//     try {
//       return {
//         payload: jwt.verify(token, secret, { ignoreExpiration: false }),
//         expired: false,
//       };
//     } catch (error) {
//       return { payload: null, expired: true };
//     }
//   },
// };
