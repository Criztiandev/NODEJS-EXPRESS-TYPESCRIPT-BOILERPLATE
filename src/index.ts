import express from "express";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/account.routes";
import { errorHandler, notFound } from "./utils/error.utils";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SESSION_SECRET)
  throw new Error("SESSION SECRET IS NOT DEFINED");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

app.use(notFound);
app.use(errorHandler);
app.listen(() => console.log(`Server is running on ${PORT}`));
