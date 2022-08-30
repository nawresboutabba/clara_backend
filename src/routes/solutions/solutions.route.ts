import * as express from "express";
import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const solutionsRouter = express.Router();

solutionsRouter
  .use(authentication)
  .use(oldRoute)
  .post("/solution/:solutionId/author")
  .post("/solution/:solutionId/leave");
