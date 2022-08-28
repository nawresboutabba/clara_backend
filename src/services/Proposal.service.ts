import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import ChallengeProposal, {
  ChallengeProposalI,
} from "../models/challenge-proposal";
import { QueryChallengeForm } from "../utils/params-query/challenge.query.params";
import * as _ from "lodash";

const ChallengeProposalService = {
  async newProposal(proposal: any): Promise<ChallengeProposalI> {
    try {
      const resp = await ChallengeProposal.create(proposal);
      return resp.toObject();
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.NEW_PROPOSAL_CHALLENGE,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getChallengeProposal(id: string): Promise<ChallengeProposalI> {
    try {
      const resp: ChallengeProposalI = await ChallengeProposal.findOne({
        proposalId: id,
      });
      return resp;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_PROPOSAL_CHALLENGE,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async listProposals(query: QueryChallengeForm): Promise<any> {
    try {
      const findQuery = {
        ..._.pickBy(
          {
            created: query.created,
            active: true,
            title: {
              $regex: `.*${query.title}.*`,
            },
            participationModeAvailable: query.participationMode,
          },
          _.identity
        ),
      };

      if (query.isStrategic != undefined) {
        findQuery.isStrategic = query.isStrategic;
      }

      const proposalChallenges = await ChallengeProposal.find({ ...findQuery })
        .skip(query.init)
        .limit(query.offset)
        /**
         * Filter order criteria unused
         */
        .sort(_.pickBy(query.sort, _.identity))
        .populate("insertedBy")
        .populate("author");

      return proposalChallenges;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.LIST_PROPOSAL_CHALLENGE,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
};

export default ChallengeProposalService;
