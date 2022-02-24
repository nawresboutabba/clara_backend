import { ChallengeI } from "../../models/situation.challenges"
import { UserI } from "../../models/users"
import { isCommitteMember } from "../acl/function.is_committe_member"

export const isCompositionUsersValid = (author: UserI, coauthor:UserI[], challenge: ChallengeI): Promise<boolean> => {
	return new Promise(async (resolve, reject)=> {
		let  areThereExternalsUser = false

		coauthor.forEach(user => {
			if(user.externalUser === true) {
				areThereExternalsUser = true
			}
		})

		if(!areThereExternalsUser){
			return resolve(true)
		}else{
			const committeeMember = await isCommitteMember(author)

			/**
             * User can invite external users like committee member or generator
             */
			if(challenge.externalContributionAvailableForCommittee 
                && challenge.externalContributionAvailableForGenerators){
				return resolve(true)
				/**
             * User can not invite external users like committee member or generator
             */
			} else if(!challenge.externalContributionAvailableForCommittee 
                && !challenge.externalContributionAvailableForGenerators){
				return resolve(false)
				/**
             * User can invite external users like committee member
             */
			}else if(challenge.externalContributionAvailableForCommittee && committeeMember.isActive){
				return resolve(true)
				/**
             * User can invite external users like generator
             */
			} else if(challenge.externalContributionAvailableForGenerators && !committeeMember.isActive){
				return resolve(true)
			}else {
				return resolve(false)
			}
		}
	})
}