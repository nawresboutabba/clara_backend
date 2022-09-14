import * as express from "express";
import * as controller from "./solutions.controller";
import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const solutionsRouter = express.Router();

solutionsRouter
  .use(authentication)
  .use(oldRoute)
  .get("/solution", controller.getSolutions)
  .get("/solution/:solutionId", controller.getSolution)
  .post("/solution/:solutionId/author", controller.changeAuthor)
  .post("/solution/:solutionId/leave", controller.leaveSolution)
  .post("/solution/:solutionId/invitation", controller.createSolutionInvite)
  .get("/solution/:solutionId/invitation", controller.getSolutionInvites)
  .post(
    "/solution/:solutionId/invitation/:invitationId/response",
    controller.responseSolutionInvite
  )
  .post(
    "/solution/:solutionId/invitation/:invitationId/cancel",
    controller.cancelSolutionInvite
  );
