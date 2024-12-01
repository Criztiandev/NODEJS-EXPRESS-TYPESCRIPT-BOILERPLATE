import { version } from "../../package.json";

import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: version,
    title: "MONGODB BOILERPLATE", // by default: 'REST API'
    description: "This is a simple nodejs express boilerplate", // by default: ''
  },
  host: " http://localhost:4000/api",
  servers: [{ url: " http://localhost:4000/" }],
  tags: [
    {
      name: "Normal Tags",
      description: "Just a normal description",
    },
  ],
};

const outputFile = "./dist/swagger-out.json";
const routes = ["./routes/*.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
