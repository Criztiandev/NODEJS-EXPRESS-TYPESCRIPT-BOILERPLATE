import { Request } from "express";
import { UserSchameValue } from "../interface/user.interface";

export interface SessionRequest extends Request {
  session: {
    user?: UserSchameValue;
    destroy: (cb: (err: any) => void) => void;
  };
}
