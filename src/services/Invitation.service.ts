import Invitation, { InvitationI } from "../models/invitation";


const InvitationService = {
    async newInvitation(invitation: InvitationI) : Promise<InvitationI> {
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