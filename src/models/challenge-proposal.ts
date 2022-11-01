import { model, Schema } from "mongoose";
import { ChallengeI } from "../routes/challenges/challenge.model";
import { situationBaseModel } from "./situation.base";
import { challengeModel } from "../routes/challenges/challenge.model";

export interface ChallengeProposalI extends ChallengeI {
  proposalId: string;
  dateProposal: Date;
  __v?: number;
}

const challengeProposalModel = {
  ...situationBaseModel,
  ...challengeModel,
  proposalId: String,
  dateProposal: Date,
};

const challengeProposal = new Schema(
  {
    ...challengeProposalModel,
  },
  { strict: false }
);

export default model("ChallengeProposal", challengeProposal);
