import * as express from "express";
import * as controller from "./tags.controller";
import authentication from "../../middlewares/authentication";

export const tagsRouter = express.Router();

tagsRouter
  .use(authentication)
  .get("/tags", controller.getTags)
  .post("/tags", controller.createTag)
