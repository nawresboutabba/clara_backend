import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Invitation, { SolutionInvitationI } from "../models/invitation";

const InvitationService = {
  async newInvitation(invitation: SolutionInvitationI) : Promise<SolutionInvitationI> {
    try{
      const invitationResp = await Invitation
        .create({...invitation})
      return invitationResp
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.NEW_INVITATION,
        HTTP_RESPONSE._500,
        error))
    }
  },
  async getSolutionInvitations(queryCompleted: any): Promise<any[]>{
    try{
      const invitations = await Invitation
        .find({...queryCompleted})
        .populate('solution')
        .populate('from')
        .populate('to')
      return invitations
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_INVITATION,
        HTTP_RESPONSE._500,
        error))
    }
  },
  // Deprecated
  async getInvitationById(invitationId: string) :Promise<any> {
    try{
      const invitation = await Invitation.findOne({
        invitationId
      })
        .populate('solution')
        .populate('from')
        .populate('to')
      return invitation
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_INVITATION,
        HTTP_RESPONSE._500,
        error))
    }
  },
  async updateInvitation(invitation: SolutionInvitationI, update: any): Promise<any>{
    try{
      const invitationResp = await Invitation.findOneAndUpdate(
        {
          invitationId: invitation.invitationId
        },{
          ...update
        },{
          new:true
        }
      )
        .populate('solution')
        .populate('from')
        .populate('to')
      return invitationResp
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.CONFIRM_INVITATION,
        HTTP_RESPONSE._500,
        error))
    }
  }
}


export default InvitationService