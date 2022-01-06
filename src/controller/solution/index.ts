import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { SolutionI } from '../../models/situation.solutions';
import { newSolution, updateSolutionPartially, deleteSolution, getSolution} from '../../repository/repository.solution';
import { SituationBody, SituationResponse } from '../situation/situation';
import { UserRequest } from '../users';


export interface SolutionBody extends SituationBody {
    /**
     * Challenge could be undefined if the solution doesn't have a challenge associated
     */
    challenge?: string,
    /**
     * if committee allow to user choose solution privacity
     */
    is_private?: boolean
}

export interface SolutionResponse extends SituationResponse{
    /**
     * challenge associated
     */
    challenge?: string,
    /**
     * Always is setting this attribute. Could be setting by user or committe.
     * Depends on solution configuration
     */
    is_private: boolean,
    /**
     * Always is setting this attribute. Depends on solution configuration
     */
    time_in_park: number,
    solutionId: string
}


@Route('solution')
export default class SolutionController extends Controller {
    @Post()
    public async newSolution (@Body() body:SolutionBody, @Request() user: UserRequest): Promise<SolutionResponse> {
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