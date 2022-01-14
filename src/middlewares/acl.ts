import { NextFunction } from "express";
import { RULES } from "../constants";
import { CAN_VIEW_CHALLENGE } from "../utils/acl/acl.can_view_challenge";
import { IS_COMMITTE_MEMBER } from "../utils/acl/acl.is_committe";
import { RequestMiddleware, ResponseMiddleware } from "./middlewares.interface";


export function acl(rule:string){
    return async function (req:RequestMiddleware, res:ResponseMiddleware, next: NextFunction){
        try{
            switch(rule){
                case RULES.CAN_VIEW_CHALLENGE: await CAN_VIEW_CHALLENGE(req)
                case RULES.IS_COMMITTE_MEMBER: await IS_COMMITTE_MEMBER(req)
            }

            next()
        }catch(error){
            next(error)
        }
    }
}