import { TAG_ORIGIN, URLS } from "../../constants";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { IntegrantStatusI } from "../../models/integrant";
import { isCommitteMember } from "./function.is_committe_member";

export async function CAN_INSERT_TAG (req: RequestMiddleware) : Promise<void>{
  try{
    let tag_type: string

    switch(req.url){
    case URLS.TAG.CHALLENGE:
      tag_type = TAG_ORIGIN.CHALLENGE
      break;
    case URLS.TAG.COMMENT:
      tag_type = TAG_ORIGIN.COMMENT
      break;
    case URLS.TAG.IDEA:
      tag_type = TAG_ORIGIN.IDEA
      break;
    default:
      return Promise.reject()
    }

    const url = req.url
    if (url == URLS.TAG.COMMENT || url == URLS.TAG.IDEA){
      req.body = {type : tag_type, ...req.body}
      return Promise.resolve()
    }else{
      /**
        * Check if user is committe member. If user is committe member, then can view solution
        */
      const committe: IntegrantStatusI = await isCommitteMember(req.user)

      if(committe.isActive){
        req.body = {type : tag_type, ...req.body}
        return Promise.resolve()
      }    
      return Promise.reject(`User can not insert tag for ${tag_type}`)        
    }
  }catch{
    return Promise.reject('User can not insert tag')  
  }
}