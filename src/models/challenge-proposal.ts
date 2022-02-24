import { model, Schema } from "mongoose";
import { ChallengeI } from "./situation.challenges";
import { situationBaseModel } from "./situation.base";
import { challengeModel } from "./situation.challenges";

export interface ChallengeProposalI extends ChallengeI{
    proposalId: string,
    dateProposal: Date,
    __v?: number
}

const challengeProposalModel = {
  ...situationBaseModel,
  ...challengeModel,
  proposalId: String,
  dateProposal: Date,
}

const challengeProposal  = new Schema({
  ...challengeProposalModel,
},{ strict: false });

export default model("ChallengeProposal", challengeProposal);