import { Request, Response } from "express";

class CookieUtils {
  constructor() {}

  setCookie(res: Response, name: string, value: string, options: any = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day by default
    };

    const cookieOptions = { ...defaultOptions, ...options };
    res.cookie(name, value, cookieOptions);
  }

  getCookie(req: Request, name: string): string | undefined {
    return req.cookies[name];
  }

  clearCookie(res: Response, name: string) {
    res.clearCookie(name);
  }

  setAuthCookie(res: Response, token: string) {
    this.setCookie(res, "auth_token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });
  }

  getAuthCookie(req: Request): string | undefined {
    return this.getCookie(req, "auth_token");
  }

  clearAuthCookie(res: Response) {
    this.clearCookie(res, "auth_token");
  }

  parseCookies(cookieString: string): { [key: string]: string } {
    return cookieString.split(";").reduce((cookies, cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      cookies[name] = decodeURIComponent(value);
      return cookies;
    }, {} as { [key: string]: string });
  }

  serializeCookie(name: string, value: string, options: any = {}): string {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
    if (options.domain) cookieString += `; Domain=${options.domain}`;
    if (options.path) cookieString += `; Path=${options.path}`;
    if (options.expires)
      cookieString += `; Expires=${options.expires.toUTCString()}`;
    if (options.httpOnly) cookieString += "; HttpOnly";
    if (options.secure) cookieString += "; Secure";
    if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;

    return cookieString;
  }
}

export default new CookieUtils();
