import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";

dotenv.config();

const PORT = Number(process.env.PORT || 8000);

const config = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "development",
  }),
  PORT: num({ default: PORT }),

  // ===== Swagger Config =====
  SWAGGER_TITLE: str({ default: "MongoDB Express API" }),
  SWAGGER_VERSION: str({ default: "1.0.0" }),
  SWAGGER_DESCRIPTION: str({
    default: "RESTful API documentation for MongoDB Express Boilerplate",
  }),
  SWAGGER_CONTACT: str({
    default: JSON.stringify({
      name: "API Support",
      email: "support@example.com",
    }),
  }),
  SWAGGER_DEVELOPMENT_SERVER: str({
    default: `http://localhost:${PORT}`,
  }),
  SWAGGER_DEVELOPMENT_SERVER_DESCRIPTION: str({
    default: "Development server",
  }),
  SWAGGER_PRODUCTION_SERVER: str({
    default: `https://api.example.com`,
  }),
  SWAGGER_PRODUCTION_SERVER_DESCRIPTION: str({
    default: "Production server",
  }),

  // ===== Swagger Config =====
});

export default config;
