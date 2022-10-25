import * as express from "express";
import * as controller from "./strategic-alignment.controller";
import authentication from "../../middlewares/authentication";

export const strategicAlignmentsRouter = express.Router();

strategicAlignmentsRouter
  .use(authentication)
  .get("/strategic-alignments", controller.getStrategicAlignment)
  .post("/strategic-alignments", controller.createStrategicAlignment)
  .put("/strategic-alignments/:strategicAlignmentId", controller.updateStrategicAlignment)
  .delete("/strategic-alignments/:strategicAlignmentId", controller.archiveStrategicAlignment)
