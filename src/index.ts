import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/account.routes";
import { errorHandler, notFound } from "./utils/error.utils";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import Routes from "./routes";

dotenv.config();

if (!process.env.SESSION_SECRET)
  throw new Error("SESSION SECRET IS NOT DEFINED");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,

    // 1 hour expiration
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

Routes(app);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}/`)
);
