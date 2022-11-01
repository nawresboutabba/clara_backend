import * as assert from "assert";
import {
  SolutionI,
  SOLUTION_STATUS,
} from "../../routes/solutions/solution.model";
import SolutionStateMachine from "../state-machine/state-machine.solution";

export function checkThirdDifficulty(body: CallableFunction): any {
  return body("transition").custom(
    async (value: string, { req }): Promise<void> => {
      try {
        const solution: SolutionI = req.resources.solution;
        const transition = await SolutionStateMachine.dispatch(
          solution.status,
          value
        );
        if (transition == SOLUTION_STATUS.PROPOSED) {
          /**
           * Is not required
           */
          return Promise.resolve();
        } else if (transition == SOLUTION_STATUS.DRAFT) {
          return Promise.resolve();
        } else if (transition == SOLUTION_STATUS.APPROVED_FOR_DISCUSSION) {
          return Promise.resolve();
        }
        throw "Transition not Implemented";
      } catch (error) {
        error.message = `third_difficulty: ${error.message}`;
        return Promise.reject(error);
      }
    }
  );
}
