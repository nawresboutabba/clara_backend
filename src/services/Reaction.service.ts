import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Reaction, { ReactionI } from "../models/interaction.reaction";

const ReactionService = {
	async newReaction(reaction: ReactionI): Promise<any> {
		return new Promise(async (resolve, reject)=>{
			try{
				const reactionEntity = await Reaction.create({
					...reaction
				})
				return resolve(reactionEntity)
			}catch(error){
				return reject(new ServiceError(
					ERRORS.SERVICE.POST_REACTION_FAIL,
					HTTP_RESPONSE._500,
					error
				))
			}

		})
	}

}
export default ReactionService;