import { Post , Controller, Route, Body, Delete , Path, Get} from 'tsoa'
import { ValidatorI } from '../../models/validator';
import { newValidator } from '../../repository/repository.validators'

export interface ValidatorBody {
    userId: string,
}

@Route('validator')
export default class ValidatorController extends Controller {
    @Post()
    public async newValidator(@Body() userId: string): Promise<ValidatorI>{
        return newValidator(userId)
    }
} 