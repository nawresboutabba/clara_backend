import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Reaction, { ReactionI } from "../models/interaction.reaction";

const ReactionService = {
  async newReaction(reaction: ReactionI): Promise<any> {
    try {
      const reactionEntity = await Reaction.create({
        ...reaction,
      });
      return reactionEntity;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.POST_REACTION_FAIL,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
};
export default ReactionService;
