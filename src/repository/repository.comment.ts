import { CommentI } from "../models/interaction.comment";
import CommentService from "../services/Comment.service";

/**
 * Generic Comment post
 * @param comment Comment
 * @returns 
 */
export const newComment = async (comment: CommentI): Promise<CommentI> => {
	return new Promise(async (resolve, reject)=> {
		try{
			const resp = await CommentService.newComment(comment)
			return resolve(resp)
		}catch(error){
			return reject(error)
		}

	})
}