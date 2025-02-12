import express from "express";
import { errorHandler, notFound, ServerError } from "./utils/error.utils";
import cookieParser from "cookie-parser";
import session from "express-session";
import Routes from "./routes";
import connectDB from "./config/connectDb";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { morganSetup } from "./config/morgan.config";
import swaggerDocs from "./utils/swagger.utils";
import config from "./config/config";
import "reflect-metadata";
import cors from "cors";

if (!config.SESSION_SECRET) {
  throw new ServerError("SESSION SECRET IS NOT DEFINED");
}

if (!config.COOKIE_SECRET) {
  throw new ServerError("COOKIE SECRET IS NOT DEFINED");
}

connectDB();

const app = express();
const PORT = config.PORT;

// Define allowed origins
const allowedOrigins = [config.FRONTEND_URL, "http://localhost:5174"].filter(
  Boolean
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser(config.COOKIE_SECRET));

app.use(
  session({
    secret: config.SESSION_SECRET,

    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : "localhost",
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
