import * as express from "express";
import { solutionsController } from "../../controller/solutions/soluttions.controller";
import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const solutionsRouter = express.Router();

solutionsRouter
  .use(authentication)
  .use(oldRoute)
  .post("/solution/:solutionId/author", solutionsController.changeAuthor)
  .post("/solution/:solutionId/leave", solutionsController.leaveSolution);
