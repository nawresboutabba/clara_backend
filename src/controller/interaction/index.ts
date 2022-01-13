import { Post , Controller, Route, Body, Delete , Path, Get} from 'tsoa'
import { ChallengeResponse } from '../challenge';
import { SolutionResponse } from '../solution';
import { UserResponse } from '../users';

export interface InteractionBody {
    author: string,
}

export interface InteractionResponse {
    insertedBy?: UserResponse,
    author: UserResponse,
    date: Date,
    challenge?: ChallengeResponse,
    solution?: SolutionResponse
}


/**
 * Endpoint for `interaction` operations
 */
 @Route('interaction')
export default class InteractionController extends Controller {
/*     @Post()
    public async newComment(@Body() comment: Comment):Promise<CommentResponse>{

    } */
}