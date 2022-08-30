import { Post , Controller, Route, Body, Get, Query, Inject, Path } from 'tsoa'
import { GroupValidatorI } from '../../models/group-validator';
import { SolutionI } from '../../models/situation.solutions';
import { UserI } from '../../models/users';
import { getAllGroupValidatorsDetails, getBaremosLinkedToSolution, getSolutionsLinked, newGroupValidator } from '../../repository/repository.group-validator';
import { BaremoResponse } from '../baremo';
import { LightSolutionResponse } from '../solutions';
import { UserResponse } from '../users';

export interface GroupValidatorBody {
    name: string,
    integrants: string[]
}

export interface GroupValidatorQueueResponse {
    group_validator_id: string,
    group_validator_name: string,
    step: string, 
    integrants: UserResponse[],
    queue: {
      idea: LightSolutionResponse
      validations?: [{
        validator?: UserResponse,
        done?: boolean
      }]
    }[]
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
    /**
     * 
     */
    @Get()
    public async getAllGroupValidatorsDetails ():Promise<any>{
      return getAllGroupValidatorsDetails()
    }
    @Get('/solution')
    public async getSolutionsLinked(@Query() query: any, @Inject() groupValidator: GroupValidatorI, @Inject() user: UserI):Promise<GroupValidatorQueueResponse>{
      return getSolutionsLinked(query, groupValidator)
    }
    
    @Get('/solution/:solutionId/baremo')
    public async getBaremosLinkedToSolution(@Path('solutionId') solutionId: string, @Inject() solution: SolutionI,@Inject() utils: any,  @Inject() user: UserI): Promise<BaremoResponse[]>{
      return getBaremosLinkedToSolution(solution)
    }
}