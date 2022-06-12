import { NextFunction } from "express";
import { RULES, OWNER } from "../constants";
import { CAN_EDIT_SOLUTION } from "../utils/acl/acl.can_edit_solution";
import { CAN_INSERT_CHALLENGE_OR_CHALLENGE_PROPOSAL } from "../utils/acl/acl.can_insert_challenge_or_challenge_proposal";
import { CAN_INSERT_TAG } from "../utils/acl/acl.can_insert_tag";
import { CAN_VIEW_CHALLENGE } from "../utils/acl/acl.can_view_challenge";
import { CAN_VIEW_SOLUTION } from "../utils/acl/acl.can_view_solution";
import { IS_ADMIN } from "../utils/acl/acl.is_admin";
import { IS_COMMITTE_MEMBER } from "../utils/acl/acl.is_committe";
import { IS_LEADER } from "../utils/acl/acl.is_leader";
import { IS_PART_OF_GROUP_VALIDATOR } from "../utils/acl/acl.is_part_of_a_group_of_validators";
import { IS_SOLUTION_CREATOR } from "../utils/acl/acl.is_solution_creator";
import { IS_THE_RECIPIENT_OF_THE_INVITATION } from "../utils/acl/acl.is_the_recipient_of_the_invitation";
import { IS_VALIDATOR_OF_SOLUTION } from "../utils/acl/acl.is_validator_of_solution";
import { IS_BAREMO_CREATOR } from "../utils/acl/is_baremo_creator";
import { RequestMiddleware, ResponseMiddleware } from "./middlewares.interface";

export function acl(rule:string){
  return async function (req:RequestMiddleware, res:ResponseMiddleware, next: NextFunction){
    try{
      /**
        * Admin Role has full Access.Same function in IS_ADMIN (case situation)
        */
      if(req.user.email === OWNER){
        return next()
      }
      switch(rule){
      case RULES.CAN_VIEW_CHALLENGE: 
        await CAN_VIEW_CHALLENGE(req)
        break;
      case RULES.CAN_VIEW_SOLUTION:
        await CAN_VIEW_SOLUTION(req)
        break;
      case RULES.IS_COMMITTE_MEMBER: 
        await IS_COMMITTE_MEMBER(req)
        break;
      case RULES.IS_LEADER: 
        await IS_LEADER(req)
        break;
      case RULES.IS_ADMIN: 
        await IS_ADMIN(req)
        break;
      case RULES.CAN_EDIT_SOLUTION:
        await CAN_EDIT_SOLUTION(req)
        break;
      case RULES.CAN_INSERT_CHALLENGE_OR_CHALLENGE_PROPOSAL:
        await CAN_INSERT_CHALLENGE_OR_CHALLENGE_PROPOSAL(req)
        break;
      case RULES.IS_SOLUTION_CREATOR:
        await IS_SOLUTION_CREATOR(req)
        break;
      case RULES.IS_PART_OF_GROUP_VALIDATOR:
        await IS_PART_OF_GROUP_VALIDATOR(req)
        break;
      case RULES.IS_VALIDATOR_OF_SOLUTION:
        await IS_VALIDATOR_OF_SOLUTION(req)
        break;
      case RULES.IS_BAREMO_CREATOR:
        await IS_BAREMO_CREATOR(req)
        break;
      case RULES.CAN_INSERT_TAG:
        await CAN_INSERT_TAG(req)
        break;
      case RULES.IS_THE_RECIPIENT_OF_THE_INVITATION:
        await IS_THE_RECIPIENT_OF_THE_INVITATION(req)
        break;
      }

      next()
    }catch(error){
      next(error)
    }
  }
}