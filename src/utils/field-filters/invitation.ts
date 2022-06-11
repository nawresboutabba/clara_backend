import { SolutionInvitationI } from "../../models/invitation";
import { lightSolutionFilter } from "./solution";
import { lightUserFilter } from "./user";

export const genericSolutionInvitationFilter = async (invitation: SolutionInvitationI): Promise<any> => {
  try{
    const {creationDate, decisionDate, invitationAccepted, type} = invitation
    const to = await lightUserFilter(invitation.to)
    const from = await lightUserFilter(invitation.from)
    const solution = await lightSolutionFilter(invitation.solution)
    return {
      creation_date: creationDate,
      decision_date: decisionDate,
      invitation_accepted: invitationAccepted,
      type,
      to,
      from,
      solution
    }
  }catch(error){
    return Promise.reject(error)
  }
}