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

if (!config.SESSION_SECRET) {
  throw new ServerError("SESSION SECRET IS NOT DEFINED");
}

if (!config.COOKIE_SECRET) {
  throw new ServerError("COOKIE SECRET IS NOT DEFINED");
}

connectDB();

const app = express();
const PORT = config.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(config.COOKIE_SECRET));
app.use(
  session({
    secret: config.SESSION_SECRET,
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
