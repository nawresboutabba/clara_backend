import * as express from "express";
import * as controller from "./solution.controller";
import authentication from "../../middlewares/authentication";

export const solutionsRouter = express.Router();

solutionsRouter
  .use(authentication)
  .get("/solutions", controller.getSolutions)
  .post("/solutions", controller.createSolution)
  .get("/solutions/:solutionId", controller.getSolution)
  .patch("/solutions/:solutionId", controller.updateSolution)
  .delete("/solutions/:solutionId", controller.deleteSolution)
  .post("/solutions/:solutionId/transition", controller.changeSolutionState)
  .post("/solutions/:solutionId/author", controller.changeSolutionAuthor)
  .post("/solutions/:solutionId/leave", controller.leaveSolution)
  .get("/solutions/:solutionId/comment", controller.getSolutionComments)
  .get(
    "/solutions/:solutionId/comment/resume",
    controller.getSolutionCommentsResume
  )
  .get(
    "/solutions/:solutionId/comment/:commentId",
    controller.getSolutionComment
  )
  .post("/solutions/:solutionId/comment", controller.createSolutionComment)
  .post("/solutions/:solutionId/invitation", controller.createSolutionInvite)
  .get("/solutions/:solutionId/invitation", controller.getSolutionInvites)
  .post(
    "/solutions/:solutionId/invitation/:invitationId/response",
    controller.responseSolutionInvite
  )
  .post(
    "/solutions/:solutionId/invitation/:invitationId/cancel",
    controller.cancelSolutionInvite
  );
