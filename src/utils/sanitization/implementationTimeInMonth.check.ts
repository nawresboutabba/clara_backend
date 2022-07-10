import * as assert from 'assert';
import { SOLUTION_STATUS } from "../../constants"
import { SolutionI } from '../../models/situation.solutions';
import SolutionStateMachine from '../state-machine/state-machine.solution';

export function checkImplementationTimeInMonths(body:CallableFunction):any{

  return body('transition').custom(async (value: string, { req }): Promise<void>=> {
    try{
      const solution:SolutionI = req.resources.solution
      const transition = await SolutionStateMachine.dispatch(solution.status , value)
      if (transition== SOLUTION_STATUS.PROPOSED){
        assert.ok(solution.differential != undefined)
        return Promise.resolve()
      }else if (transition == SOLUTION_STATUS.DRAFT){
        return Promise.resolve()
      }
      throw 'Transtition not Implemented'
    }catch(error){
      error.message = `implementation_time_in_month: ${error.message}`
      return Promise.reject(error)
    }
  })}