import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:3000",
};

const outputFile = "./dist/swagger-out.json";
const routes = ["./routes/*.ts"];

swaggerAutogen(outputFile, routes, doc);
