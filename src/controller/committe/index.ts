import { Controller, Body, Post, Route, Path, Delete } from "tsoa";
import { CommitteI } from "../../models/committe";
import { newLeader , newCommitte} from "../../repository/repository.committe";


@Route('committe')
export default class CommitteController extends Controller {
    @Post('/leader')
    public async newLeader(@Body() userId: string):Promise<CommitteI> {
        return newLeader(userId)
    }
    @Post()
    public async newCommitte(@Body() body: any): Promise<any>{
        return newCommitte(body.userId, body.committe)
    }
}