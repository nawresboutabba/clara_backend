import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Comment, { CommentI } from "../models/interaction.comment";


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
    }
}

export default CommentService