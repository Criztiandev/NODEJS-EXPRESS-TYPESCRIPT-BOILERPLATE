import swaggerUI from "swagger-ui-express";
import { Express } from "express";
import swaggerJSONpayload from "../docs/swagger.json";

const swaggerDocs = (app: Express) => {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSONpayload));

  console.log(
    `Swagger Docs is available at http://localhost:${process.env.PORT}/docs`
  );
};

export default swaggerDocs;
