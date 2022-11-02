import * as express from "express";
import * as controller from "./area.controller";
import authentication from "../../middlewares/authentication";

export const areaRouter = express.Router();

areaRouter
  .use(authentication)
  .get("/areas", controller.getAreas)
  .post("/areas", controller.createArea)
  .put("/areas/:baremaId", controller.updateArea)
  .put("/areas/:baremaId/archive", controller.archiveArea);
