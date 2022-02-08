import { INVITATIONS } from "../constants";
import { InvitationI, SolutionCoauthorshipInvitationI, SolutionTeamInvitationI } from "../models/invitation";
import { SolutionI } from "../models/situation.solutions";
import { TeamI } from "../models/team";
import { UserI } from "../models/users";
import InvitationService from "../services/Invitation.service";
import UserService from "../services/User.service";

/* export const newInvitation = async (from: UserI, body: InvitationBody): Promise<InvitationI> => {
    return new Promise(async (resolve, reject)=> {
        try{
            const guestUser = await UserService.getUserActiveByUserId(body.from)

            const invitation: InvitationI = {
                from,
                to: guestUser,
                type: body.type,
                creationDate: new Date(),
                resourceId: body.resource_id
            }
            const resp = await InvitationService.newInvitation(invitation)
            return resolve(resp)
        }catch(error){
            return reject (error)
        }
    })
} */

/**
 * Invitation generator to compose a team. 
 * It doesn't have to be a synchronous task.
 * @param creator 
 * @param guests 
 * @param situation 
 * @param team 
 * @returns 
 */
export const generateSolutionTeamInvitation= async (creator: UserI, guests: Array<UserI> , solution:SolutionI, team: TeamI): Promise<InvitationI[]> => {
    return new Promise((resolve, reject)=> {
        let invitations = []
        const creationDate = new Date()
        guests.forEach(guest => {
            const invitation : SolutionTeamInvitationI = {
                to: creator,
                from: guest,
                creationDate,
                type: INVITATIONS.TEAM_PARTICIPATION,
                team,
                solution               
            }
            invitations.push(InvitationService.newInvitation(invitation))
        })
        Promise
        .all(invitations)
        .then(result => {
            return resolve(result) 
        })
        .catch(error=> {
            /**
             * @TODO manage error
             */
            return reject()
        }) 
    })
}

export const generateSolutionCoauthorshipInvitation= async (creator: UserI, guests: Array<UserI> , solution:SolutionI): Promise<Array<InvitationI>>=> {
    return new Promise((resolve, reject)=>{
        let invitations = []
        const creationDate = new Date()
        guests.forEach(guest => {
            const invitation: SolutionCoauthorshipInvitationI = {
                to: creator,
                from: guest,
                creationDate,
                type: INVITATIONS.COAUTHORSHIP_PARTICIPATION,
                solution                
            }

            invitations.push(InvitationService.newInvitation(invitation))
        }) 
        Promise
        .all(invitations)
        .then(result => {
            console.log(result)
            return resolve(result) 
        })
        .catch(error=> {
            /**
             * @TODO manage error
             */
            return reject()
        })   
    })
}