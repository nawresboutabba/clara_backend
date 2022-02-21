import { model, Schema } from "mongoose";
import { ChallengeI } from "./situation.challenges";

export interface ChallengeProposalI extends ChallengeI{
    proposalId: string,
    dateProposal: Date,
    __v?: number
}

const challengeProposal  = new Schema({
    proposalId: String,
    dateProposal: Date,
},{ strict: false });

export default model("ChallengeProposal", challengeProposal);