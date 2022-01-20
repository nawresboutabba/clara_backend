import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request, Query, Example} from 'tsoa'
import { SolutionI } from '../../models/situation.solutions';
import { listSolutions } from '../../repository/repository.solution';
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
    is_private?: boolean,
    /**
     * Participation defines the type of intervention 
     * that the creator chose to make the proposal.
     * - It can be TEAM: then the creator plus the guests, form a team
     * - It can be INDIVIDUAL_WITH_COAUTHORSHIP: then the creator will be the author and the guests will be co-authors
     * the interpretation depends on the value in chosen_mode
     */
     participation : {
        chosen_mode: string,
        creator: string,
        guest: Array<string>
        /**
         * is used if the modality is equal to TEAM
         */
        team_name?: string
    }
}

export interface SolutionResponse extends SituationResponse{
    /**
     * challenge associated
     */
    challenge_id?: string,
    /**
     * Always is setting this attribute. Could be setting by user or committe.
     * Depends on solution configuration
     */
    is_private: boolean,
    /**
     * Always is setting this attribute. Depends on solution configuration
     */
    time_in_park: number,
    /**
     * Solution ID
     */
    solution_id: string,
    /**
     * If participation is equal to INDIVIDUAL_WITH_COAUTHORSHIP, 
     * then the valid fields for reading are "author" and "coauthors"
     * If participation is equal to TEAM,
     * then the valid field for reading is "team"
     */
    participation_mode_choosed: string
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
    public async getSolution(@Path('solutionId') solutionId:string ,@Request() solution: SolutionI): Promise<SolutionResponse> {
        return getSolution(solutionId, solution)
    }

    /**
     * Solutions Listing without challenge associated
     *  
     * @param query 
     * @returns 
     */
    @Get()
    public async listSolutions(@Query() query?: any): Promise<SolutionResponse []> {
        return listSolutions(query, undefined)
    }
}