import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { SolutionI } from '../../models/situation.solutions';
import { newSolution, updateSolutionPartially, deleteSolution, getSolution} from '../../repository/solution';
import { UserRequest } from '../users';


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

export interface SolutionResponse {
    solutionId: string,
    challenge?:{
        created: Date,
        description: string,
        
    }
}

@Route('solution')
export default class SolutionController extends Controller {
    @Post()
    public async newSolution (@Body() body:SolutionBody, @Request() user: UserRequest): Promise<SolutionI> {
        return newSolution(body, user)
    }
    @Patch(':solutionId')
    public async updateSolutionPartially(@Body() body:SolutionBody, @Path('solutionId') solutionId: string): Promise<SolutionI>{
        return updateSolutionPartially(body, solutionId)
    }
    @Delete(':solutionId')
    public async deleteSolution(@Path('solutionId') solutionId: string): Promise <boolean> {
        return deleteSolution(solutionId)
    }
    @Get(':solutionId')
    public async getSolution(@Path('solutionId') solutionId:string ,@Request() solution: SolutionI): Promise<SolutionI> {
        return getSolution(solutionId, solution)
    }
}