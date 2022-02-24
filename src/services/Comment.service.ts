import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Comment, { CommentI } from "../models/interaction.comment";
import { ChallengeI } from "../models/situation.challenges";
import { UserI } from "../models/users";


const CommentService = {
	async newComment (comment: CommentI) : Promise<any>{
		return new Promise(async (resolve, reject)=> {

			try{
				const resp = await Comment.create({
					...comment
				})
				return resolve(resp)
			}catch(error){
				return new ServiceError(
					ERRORS.SERVICE.POST_COMMENT_FAIL,
					HTTP_RESPONSE._500,
					error
				)
			}
		})
	},
	async getComments(challenge: ChallengeI, user: UserI): Promise<any> {
		return new Promise(async (resolve, reject)=> {
			try{
				const comments = await Comment.find({
					challenge: challenge,
					$or:[
						{
							author: user
						},
						{
							isPrivate: false
						}
					]
				})
					.populate('author')
					.populate('insertedBy')
				return resolve(comments)
			}catch(error){
				return reject(new ServiceError(
					ERRORS.SERVICE.GET_COMMENTS,
					HTTP_RESPONSE._500,
					error
				))
			}
		})
	}
}

export default CommentService