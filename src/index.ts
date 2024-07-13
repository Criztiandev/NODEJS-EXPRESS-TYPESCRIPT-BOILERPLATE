import express from "express";
import authRoutes from "./routes/auth.routes";
import { errorHandler, notFound } from "./utils/error.utils";

const app = express();
const PORT = 8000;

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);
app.listen(() => console.log(`Server is running on ${PORT}`));
