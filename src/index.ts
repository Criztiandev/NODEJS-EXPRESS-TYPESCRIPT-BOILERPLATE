import express from "express";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/account.routes";
import { errorHandler, notFound } from "./utils/error.utils";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

app.use(notFound);
app.use(errorHandler);
app.listen(() => console.log(`Server is running on ${PORT}`));
