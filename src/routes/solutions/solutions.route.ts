import * as express from "express";
import { solutionsController } from "../../controller/solutions/solutions.controller";
import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const solutionsRouter = express.Router();

solutionsRouter
  .use(authentication)
  .use(oldRoute)
  .get("/solution/:solutionId", solutionsController.getSolution)
  .post("/solution/:solutionId/author", solutionsController.changeAuthor)
  .post("/solution/:solutionId/leave", solutionsController.leaveSolution)
  .post(
    "/solution/:solutionId/invitation",
    solutionsController.createSolutionInvite
  )
  .get(
    "/solution/:solutionId/invitation",
    solutionsController.getSolutionInvites
  )
  .post(
    "/solution/:solutionId/invitation/:invitationId/response",
    solutionsController.responseSolutionInvite
  )
  .post(
    "/solution/:solutionId/invitation/:invitationId/cancel",
    solutionsController.cancelSolutionInvite
  );
