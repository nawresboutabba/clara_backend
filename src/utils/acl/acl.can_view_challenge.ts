import { ERRORS, HTTP_RESPONSE, WSALEVEL } from "../../constants"
import RoutingError from "../../handle-error/error.routing"
import { RequestMiddleware } from "../../middlewares/middlewares.interface"
import { ChallengeI } from "../../models/situation.challenges"
import ChallengeService from "../../services/Challenge.service"
import * as _ from 'lodash'; 

/**
 * Check that the challenge can be viewed by a user.
 * RULES:
 * - USER { externalUser: true} -> forbidden
 * - If Challenge {WSALevel: "COMPANY"} and USER { externalUser: false} -> available
 * - If Challenge {WSALevel: "AREA"} then user.areaVisible in challenge.areasAvailable -> available
 * @param req
 * @returns 
 */

export function CAN_VIEW_CHALLENGE (req: RequestMiddleware): Promise<void> {
  return new Promise (async (resolve, reject)=> {
    try{
      if (!(req.resources?.challenge)){
        const challenge: ChallengeI = await ChallengeService.getChallengeActiveById(req.params.challengeId)
        if(challenge == null){
          return reject(new RoutingError(
            ERRORS.ROUTING.CHALLENGE_FORBIDDEN,
            HTTP_RESPONSE._500
          ))                    
        }
        req.resources = {challenge}
      }
      const user = req.user
      if (user.externalUser){
        /**
                 * Temporaly: Return error if a external User want to see a challenge
                 * @TODO create a whitelist for manage external users
                 */
        return reject(new RoutingError(
          ERRORS.ROUTING.CHALLENGE_FORBIDDEN,
          HTTP_RESPONSE._500
        ))
      } else {
        if (req.resources.challenge.WSALevelChosed == WSALEVEL.AREA){
          const userAreaVisible = user.areaVisible.filter((area)=> {return area.areaId})
          const challengeAreasAvailable = req.resources.challenge.areasAvailable.filter((area)=> {return area.areaId})
          const intersection = _.intersection(challengeAreasAvailable, userAreaVisible)
    
          if (intersection.length > 0){
            return resolve()
          }
          return reject(new RoutingError(
            ERRORS.ROUTING.CHALLENGE_FORBIDDEN,
            HTTP_RESPONSE._500
          ))
        }else{
          /**
                     * Challenge WSALevel = "COMPANY"
                     */
          return resolve()
        }
      }
    }catch(error){
      return reject(error)
    }
  })
}
