import * as express from "express";
import * as controller from "./solution.controller";
import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const solutionsRouter = express.Router();

solutionsRouter
  .use(authentication)
  .use(oldRoute)
  .get("/solution", controller.getSolutions)
  .get("/solution/:solutionId", controller.getSolution)
  .patch("/solution/:solutionId", controller.updateChallenge)
  .delete("/solution/:solutionId", controller.deleteSolution)
  .post("/solution/:solutionId/transition", controller.changeSolutionState)
  .post("/solution/:solutionId/author", controller.changeSolutionAuthor)
  .post("/solution/:solutionId/leave", controller.leaveSolution)
  .get("/solution/:solutionId/comment", controller.getSolutionComments)
  .get(
    "/solution/:solutionId/comment/resume",
    controller.getSolutionCommentsResume
  )
  .get(
    "/solution/:solutionId/comment/:commentId",
    controller.getSolutionComment
  )
  .post("/solution/:solutionId/comment", controller.createSolutionComment)
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
