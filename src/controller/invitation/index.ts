import { truncate } from "fs"
import { Controller, Post, Route } from "tsoa"
import { InvitationI } from "../../models/invitation"
import { UserI } from "../../models/users"



@Route('invitation')
export default class InvitationController extends Controller {
/*     @Post()
    public async newInvitation(from: UserI, body: InvitationBody): Promise<any>{
    
        return true
    } */
}