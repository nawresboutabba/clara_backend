import { SolutionInvitationI } from "../../models/invitation";
import { lightSolutionFilter } from "./solution";
import { lightUserFilter } from "./user";

export const genericSolutionInvitationFilter = async (invitation: SolutionInvitationI): Promise<any> => {
  try{
    const {creationDate, decisionDate, invitationAccepted, type, invitationId, resource, status} = invitation
    const to = await lightUserFilter(invitation.to)
    const from = await lightUserFilter(invitation.from)
    const solution = await lightSolutionFilter(invitation.solution)
    return {
      resource,
      invitation_id: invitationId,
      creation_date: creationDate,
      decision_date: decisionDate,
      invitation_accepted: invitationAccepted,
      type,
      to,
      from,
      solution,
      status
    }
  }catch(error){
    return Promise.reject(error)
  }
}

export const genericArraySolutionInvitationFilter = async (invitations: SolutionInvitationI[]): Promise<any> => {
  try{
    const arrayInvitations: Array<Promise<SolutionInvitationI>>= []
    invitations.forEach(invitation => {
      arrayInvitations.push(genericSolutionInvitationFilter(invitation))
    })
    return await Promise.all(arrayInvitations)
      .then(result => {
        return result
      })
      .catch(error=> {
        return Promise.reject(error)
      })  
  }catch(error){
    return Promise.reject(error)
  }
}