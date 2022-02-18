import { NextFunction } from "express";
import { RULES, OWNER } from "../constants";
import { CAN_EDIT_SOLUTION } from "../utils/acl/acl.can_edit_solution";
import { CAN_VIEW_CHALLENGE } from "../utils/acl/acl.can_view_challenge";
import { CAN_VIEW_SOLUTION } from "../utils/acl/acl.can_view_solution";
import { IS_ADMIN } from "../utils/acl/acl.is_admin";
import { IS_COMMITTE_MEMBER } from "../utils/acl/acl.is_committe";
import { IS_LEADER } from "../utils/acl/acl.is_leader";
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
            }

            next()
        }catch(error){
            next(error)
        }
    }
}