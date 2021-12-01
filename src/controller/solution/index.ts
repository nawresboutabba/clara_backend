import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { TYPE_SOLUTION } from '../../models/solutions';
import { newSolution, updateSolutionPartially, deleteSolution, getSolution} from '../../repository/solution';

export interface UserRequest{
    email: string;
    userId: string;
    firstName: string;
    lastName:string;
}

export interface SolutionBody {
    challenge_id?:string,
    description?: string,
    images?: Array<string>,
    can_choose_scope?:boolean,
    is_private?:boolean,
    status?: string,
    time_in_park?: number,
    baremo_validator?: Array<String>,
    baremo_referrer?: string,
    file_name?: string
}

@Route('solution')
export default class SolutionController extends Controller {
    @Post()
    public async newSolution (@Body() body:SolutionBody, @Request() user: UserRequest): Promise<TYPE_SOLUTION> {
        return newSolution(body, user)
    }
    @Patch(':solutionId')
    public async updateSolutionPartially(@Body() body:SolutionBody, @Path('solutionId') solutionId: string): Promise<TYPE_SOLUTION>{
        return updateSolutionPartially(body, solutionId)
    }
    @Delete(':solutionId')
    public async deleteSolution(@Path('solutionId') solutionId: string): Promise <boolean> {
        return deleteSolution(solutionId)
    }
    @Get(':solutionId')
    public async getSolution(@Path('solutionId') solutionId:string ,@Request() solution: TYPE_SOLUTION): Promise<TYPE_SOLUTION> {
        return getSolution(solutionId, solution)
    }
}