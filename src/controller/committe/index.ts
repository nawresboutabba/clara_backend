import { Controller, Body, Post, Route, Path, Delete } from "tsoa";
import { CommitteI } from "../../models/committe";
import { newLeader, newCommitte } from "../../repository/repository.committe";


@Route('committe')
export default class CommitteController extends Controller {
    @Post('/leader')
    public async newLeader(userId: string):Promise<CommitteI> {
        return newLeader(userId)
    }
    @Post('/')
    public async newCommitte(userId: string, committe: Array<string>){
        return newCommitte(userId, committe)
    }
}