import express from "express";
import { errorHandler, notFound } from "./utils/error.utils";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import Routes from "./routes";
import connectDB from "./config/connectDb";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import swaggerDocs from "./utils/swagger.utils";
import { morganSetup } from "./config/morgan.config";

dotenv.config();

if (!process.env.SESSION_SECRET)
  throw new Error("SESSION SECRET IS NOT DEFINED");

connectDB();

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
    store: MongoStore.create({
      client: mongoose.connection.getClient() as any,
    }),
  })
);

swaggerDocs(app);
morganSetup(app);
Routes(app);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}/`)
);
