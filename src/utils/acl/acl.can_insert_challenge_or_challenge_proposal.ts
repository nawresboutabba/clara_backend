import { COMMITTE_ROLE, ERRORS, HTTP_RESPONSE, URLS } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { IntegrantStatusI } from "../../models/integrant";
import { isCommitteeMember } from "./function.is_committe_member";

/**
 * Committee members can submit challenge proposals
 * that can be edited by all other members.
 * The leader can create the challenges.
 * The validations for the two are similar,
 * only they differ in their final condition. If it's a challenge , it goes to the challenge collection. Otherwise if it is a draft, it goes to the drafts collection, where it can be edited.
 * @param req
 * @returns
 */
export async function CAN_INSERT_CHALLENGE_OR_CHALLENGE_PROPOSAL(
  req: RequestMiddleware
): Promise<void> {
  const url = req.url;
  const committe: IntegrantStatusI = await isCommitteeMember(req.user);
  /**
   * Leader can insert a challenge or proposal challenge.
   *
   */
  if (committe.isActive && committe.role === COMMITTE_ROLE.LEADER) {
    return;
  } else if (
    /**
     * If user isn't leader but is a committee member
     * just can insert a proposal challenge.
     */
    committe.isActive &&
    committe.role === COMMITTE_ROLE.GENERAL &&
    url == URLS.CHALLENGE.CHALLENGE_PROPOSE
  ) {
    return;
  } else {
    throw new RoutingError(
      ERRORS.ROUTING.OPERATION_NOT_AVAILABLE,
      HTTP_RESPONSE._500
    );
  }
}
