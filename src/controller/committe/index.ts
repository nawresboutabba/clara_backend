import { Controller, Body, Post, Route, Path, Delete } from "tsoa";
import { CommitteI } from "../../models/committe";
import { newLeader } from "../../repository/repository.committe";


@Route('committe')
export default class CommitteController extends Controller {
    @Post('/leader')
    public async newLeader(@Body() userId: string):Promise<CommitteI> {
        return newLeader(userId)
    }
}