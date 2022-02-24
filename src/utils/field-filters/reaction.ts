import { ReactionResponse } from "../../controller/reaction";
import { ReactionI } from "../../models/interaction.reaction";
import { genericUserFilter } from "./user";

export const genericReactionFilter = async (reaction: ReactionI): Promise<ReactionResponse> => {
	return new Promise(async (resolve, reject)=> {
		const {
			type,
			date,
		} = reaction
		const author = await genericUserFilter(reaction.author)
		return resolve({
			type, 
			date,
			author
		})
	})
}