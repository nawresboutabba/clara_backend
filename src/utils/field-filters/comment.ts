import { CommentResponse } from "../../controller/comment";
import { CommentI } from "../../models/interaction.comment";
import { genericUserFilter } from "./user";

export const genericCommentFilter = async (commentEntity: CommentI): Promise<CommentResponse> => {
    return new Promise(async (resolve, reject)=> {
        const {
            comment,
            date
        } = commentEntity
        const author = await genericUserFilter(commentEntity.author)
        let resp: CommentResponse = {
            comment,
            date, 
            author
        }
        if (commentEntity.author.userId == commentEntity.insertedBy.userId){
            return resolve({... resp})
        }
        const insertedBy = await genericUserFilter(commentEntity.insertedBy)

        resp.insertedBy = insertedBy
        return resolve({...resp})
    })
}