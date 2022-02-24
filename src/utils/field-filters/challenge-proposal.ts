import { ChallengeProposalI } from "../../models/challenge-proposal";
import { ChallengeProposalResponse } from "../../controller/challenge";
import { genericChallengeFilter } from "./challenge";

export const genericChallengeProposalFilter = async (challengeProposal : ChallengeProposalI): Promise<ChallengeProposalResponse> => {
	try{
		const challengeInformation = await genericChallengeFilter(challengeProposal)
		const resp = {
			...challengeInformation,
			proposal_id: challengeProposal.proposalId,
			date_proposal: challengeProposal.dateProposal
		}
		return resp
	}catch(error){
		return Promise.reject(error)
	}
}

export const genericArrayChallengeProposalFilter = async (challengeProposals : ChallengeProposalI[]): Promise<ChallengeProposalResponse[]> => {
	try{
		const arrayChallenge: Array<Promise<ChallengeProposalResponse>>= []
		challengeProposals.forEach(challengeProposal => {
			arrayChallenge.push(genericChallengeProposalFilter(challengeProposal))
		})
		const resp = await Promise.all(arrayChallenge)
		return resp
	}catch(error){
		return Promise.reject(error)
	}
}