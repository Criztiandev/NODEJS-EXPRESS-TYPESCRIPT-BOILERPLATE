import swaggerAutogen from "swagger-autogen";
import config from "./config";

const swaggerConfig = {
  info: {
    title: config.SWAGGER_TITLE,
    version: config.SWAGGER_VERSION,
    description: config.SWAGGER_DESCRIPTION,
    contact: config.SWAGGER_CONTACT,
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url:
        config.NODE_ENV === "development"
          ? config.SWAGGER_DEVELOPMENT_SERVER
          : config.SWAGGER_PRODUCTION_SERVER,
      description:
        config.NODE_ENV === "development"
          ? config.SWAGGER_DEVELOPMENT_SERVER_DESCRIPTION
          : config.SWAGGER_PRODUCTION_SERVER_DESCRIPTION,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
      sessionAuth: [],
    },
  ],
};

const outputFile = "./src/docs/swagger.json";
const endpointFiles = ["./src/routes/index.ts"];

// Generate swagger documentation
swaggerAutogen({
  openapi: "3.0.0",
  autoHeaders: true,
  autoQuery: true,
  autoBody: true,
})(outputFile, endpointFiles, swaggerConfig);
