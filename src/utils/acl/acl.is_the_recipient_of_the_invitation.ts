import { RESOURCE } from "../../constants"
import { RequestMiddleware } from "../../middlewares/middlewares.interface"
import InvitationService from "../../services/Invitation.service"

export async function IS_THE_RECIPIENT_OF_THE_INVITATION (req: RequestMiddleware): Promise<void> {
  try{
    const invitation = await InvitationService.getInvitationById(req.params.invitationId)
    /**
     * Check if current user is the guest
     */
    if ( !(req.user.userId == invitation.from.userId)){
      return Promise.reject('User is not the guest')
    }
    req.utils = {...req.utils, invitation}
    switch(invitation.resource){
    case RESOURCE.SOLUTION :
      if(req.params.solutionId == invitation.solution.solutionId){
        const solution = invitation.solution
        req.resources = {solution, ...req.resources}
        return Promise.resolve()
      }else{
        return Promise.reject('invitation does not match with this resource')
      }
    }
    return Promise.reject('Resource failed')    
  }catch(error){
    return Promise.reject(error)
  }
}