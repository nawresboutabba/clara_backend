import Invitation, { SolutionInvitationI } from "../models/invitation";


const InvitationService = {
  async newInvitation(invitation: SolutionInvitationI) : Promise<SolutionInvitationI> {
    return new Promise(async (resolve, reject)=> {
      try{
        const invitationResp = await Invitation
          .create({...invitation})
        return resolve(invitationResp)
      }catch(error){
        return reject(error)
      }

    })
  }
}


export default InvitationService