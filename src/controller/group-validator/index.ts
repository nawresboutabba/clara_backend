import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { newGroupValidator } from '../../repository/repository.group-validator';

export interface GroupValidatorBody {
    name: string,
}

@Route('/group-validator')
export default class GroupValidatorController extends Controller{
    /**
     * Fix response
     * @param body 
     * @returns 
     */
    @Post()
    public async newGroupValidator (@Body() body: GroupValidatorBody ):Promise<any>{
        return newGroupValidator(body)
    }
}