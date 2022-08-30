import * as assert from "assert";
import { IS_NEW_FOR, SOLUTION_STATUS } from "../../constants";
import { SolutionI } from "../../models/situation.solutions";
import SolutionStateMachine from "../state-machine/state-machine.solution";

export function checkIsNewFor(body: CallableFunction): any {
  return body("transition").custom(
    async (value: string, { req }): Promise<void> => {
      try {
        const solution: SolutionI = req.resources.solution;
        const transition = await SolutionStateMachine.dispatch(
          solution.status,
          value
        );
        if (transition == SOLUTION_STATUS.PROPOSED) {
          assert.ok(solution.isNewFor != undefined);
          assert.ok(solution.isNewFor in IS_NEW_FOR);
          return Promise.resolve();
        } else if (transition == SOLUTION_STATUS.DRAFT) {
          return Promise.resolve();
        } else if (transition == SOLUTION_STATUS.APPROVED_FOR_DISCUSSION) {
          return Promise.resolve();
        }
        throw "Transition not Implemented";
      } catch (error) {
        error.message = `is_new_for: ${error.message}`;
        return Promise.reject(error);
      }
    }
  );
}
