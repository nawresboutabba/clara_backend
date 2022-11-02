import * as express from "express";
import * as controller from "./barema.controller";
import authentication from "../../middlewares/authentication";

export const baremaRouter = express.Router();

baremaRouter
  .use(authentication)
  .get("/baremas", controller.getBaremas)
  .post("/baremas", controller.createBarema)
  .put("/baremas/:baremaId", controller.updateBarema)
  .put("/baremas/:baremaId/archive", controller.archiveBarema)
