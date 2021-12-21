import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { newGroupValidator } from '../../repository/repository.group-validator';

export interface GroupValidatorBody {
    name: string,
    validators: Array<string>,
    area:string
}

@Route('/group-validator')
export default class GroupValidatorController extends Controller{
    @Post()
    public async newGroupValidator (@Body() body: GroupValidatorBody ){
        return newGroupValidator(body.name, body.validators, body.area)
    }
}