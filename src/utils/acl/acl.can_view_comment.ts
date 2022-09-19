import { COMMENT_LEVEL, ERRORS, HTTP_RESPONSE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { SolutionI } from "../../models/situation.solutions";
import SolutionService from "../../services/Solution.service";
import * as _ from 'lodash';
import { IntegrantStatusI } from "../../models/integrant";
import { isCommitteMember } from "./function.is_committe_member";
import CommentService from "../../services/Comment.service";



export async function CAN_VIEW_COMMENT(req: RequestMiddleware): Promise<void> {
  try {
    /**
     * Check comment situation
     */
    const comment = await CommentService.getComment(req.params.commentId)
    if (!comment) {
      return Promise.reject(new RoutingError(
        ERRORS.ROUTING.COMMENT_DOES_NOT_EXIST,
        HTTP_RESPONSE._500
      ))
    }
    const solution: SolutionI = await SolutionService.getSolutionActiveById(comment.resource._id)
    req.resources = { ...req.resources, solution }

    const user = req.user
    /**
     * Check if user is committe member. If user is committe member, then can view solution
     */
    const committe: IntegrantStatusI = await isCommitteMember(req.user)

    /**
     * if the is not committe member, then check if can see the comment
     */
    let canSee = false

    if (committe.isActive) {
      canSee = true
    } else if (user.email == comment.author.userId) {
      /**
       * Is comment creater OK.
       */
    } else if (comment.scope == COMMENT_LEVEL.GROUP) {
      /**
     * GROUP CASE. Is part of idea AS AUTHOR, COAUTHOR OR EXTERNALOPINION.
     */
      const coauthor = solution.coauthor.filter(userC => userC.userId == user.userId)
      const externalOpinion = solution.externalOpinion.filter(userEO => userEO.userId == user.userId)

      if (coauthor.length > 0 || externalOpinion.length > 0 || solution.author.userId == user.userId) {
        canSee = true
      }
    } else if (comment.scope == COMMENT_LEVEL.PUBLIC && !user.externalUser) {
      canSee = true
    }

    if (canSee) {
      /**
        * Check if a parent or child. 
        */
      if (comment.parent) {
        req.utils = { ...req.utils, childComment: comment }
      } else {
        req.utils = { ...req.utils, parentComment: comment }
      }
      return Promise.resolve()
    } else {
      return Promise.reject(ERRORS.ROUTING.COMMENT_FORBBIDEN)
    }
  } catch (error) {
    return Promise.reject(ERRORS.ROUTING.COMMENT_FORBBIDEN)
  }
}
