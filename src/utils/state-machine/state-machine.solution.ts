import { ERRORS } from "../../constants";
import { SOLUTION_STATUS_ENUM } from "../../routes/solutions/solution.model";

const SOLUTION_STATUS = SOLUTION_STATUS_ENUM.enum;
/**
 * Solutions state machine
 * https://drive.google.com/file/d/1JFNcXbiDoof3LKlKQEQFrFnpRt4aq3E7/view?usp=sharing
 *
 */
const machine = {
  state: SOLUTION_STATUS.DRAFT,
  transitions: {
    /**
     * When a Solution is created, it is in the draft state.
     * Committee can then edit the challenge. But the challenge is saved in
     * ChallengeProposal Collection
     */
    DRAFT: {
      confirm: function () {
        this.changeState(SOLUTION_STATUS.PROPOSED);
      },
    },
    /**
     * Solution is ready for init. Initialización is triggered by TIMER
     */
    PROPOSED: {
      published: function () {
        this.changeState(SOLUTION_STATUS.APPROVED_FOR_DISCUSSION);
      },
      draft: function () {
        this.changeState(SOLUTION_STATUS.DRAFT);
      },
      analyze: function () {
        this.changeState(SOLUTION_STATUS.ANALYZING);
      },
    },
    /**
     * Solution in the park
     */
    APPROVED_FOR_DISCUSSION: {
      draft: function () {
        this.changeState(SOLUTION_STATUS.DRAFT);
      },
      evaluate: function () {
        this.changeState(SOLUTION_STATUS.PROPOSED);
      },
    },
    /**
     * Solution ready for analysis
     */
    READY_FOR_ANALYSIS: {
      analyze: function () {
        this.changeState(SOLUTION_STATUS.ANALYZING);
      },
    },
    /**
     * Challenge under committee analysis
     */
    ANALYZING: {
      prepare: function () {
        this.changeState(SOLUTION_STATUS.PROPOSED);
      },
      approved: function () {
        this.changeState(SOLUTION_STATUS.APPROVED_FOR_CONSTRUCTION);
      },
    },
    APPROVED_FOR_CONSTRUCTION: {
      /**
       * One of possible final for a solution
       */
    },
  },
  dispatch(actualStatus: string, actionName: string, ...payload: any) {
    const action = this.transitions[actualStatus][actionName];

    if (action) {
      action.apply(machine, ...payload);
      return this.state;
    } else {
      /**
       * Combination actualState and actionName is not valid
       */
      throw ERRORS.STATE_MACHINE.ACTION_NOT_FOUND;
    }
  },
  changeState(newState: string) {
    /**
     * validate that newState actually exists
     */
    this.state = newState;
  },
  init() {
    return this.state;
  },
};

const SolutionStateMachine = Object.create(machine, {
  name: {
    writable: false,
    enumerable: true,
    value: "SolutionStateMachine",
  },
});

export default SolutionStateMachine;
