import * as assert from 'assert';
import { SOLUTION_STATUS } from "../../constants"
import { SolutionI } from '../../models/situation.solutions';
import SolutionStateMachine from '../state-machine/state-machine.solution';

export function checkThirdDifficulty(body:CallableFunction):any{

  return body('transition').custom(async (value: string, { req }): Promise<void>=> {
    try{
      const solution:SolutionI = req.resources.solution
      const transition = await SolutionStateMachine.dispatch(solution.status , value)
      if (transition== SOLUTION_STATUS.PROPOSED){
        /**
         * Is not required
         */
        return Promise.resolve()
      }else if (transition == SOLUTION_STATUS.DRAFT){
        return Promise.resolve()
      }else if (transition == SOLUTION_STATUS.APROVED_FOR_DISCUSSION){
        return Promise.resolve()
      }
      throw 'Transtition not Implemented'
    }catch(error){
      error.message = `third_difficulty: ${error.message}`
      return Promise.reject(error)
    }
  })}