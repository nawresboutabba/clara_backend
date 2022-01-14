import { IntegrantStatusI } from "../../models/integrant";
import { UserI } from "../../models/users";
import IntegrantService from "../../services/Integrant.service";

export function isCommitteMember (user: UserI):Promise<IntegrantStatusI>{
    return new Promise(async (resolve, reject)=> {
        const committeMember = await IntegrantService.checkUserInCommitte(user.userId)
        return resolve(committeMember)
    })
}