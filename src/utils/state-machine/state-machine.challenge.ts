import { ERRORS } from "../../constants";
import { CHALLENGE_STATUS_ENUM } from "../../routes/challenges/challenge.model";

const CHALLENGE_STATUS = CHALLENGE_STATUS_ENUM.enum;
const machine = {
  state: CHALLENGE_STATUS.DRAFT,
  transitions: {
    /**
     * When a challenge is created, it is in the draft state.
     * Committee can then edit the challenge. But the challenge is saved in
     * ChallengeProposal Collection
     */
    DRAFT: {
      confirm() {
        this.changeState(CHALLENGE_STATUS.PROPOSED);
      },
    },
    /**
     * Challenge is ready for init. Initialización is triggered by TIMER
     */
    PROPOSED: {
      published() {
        this.changeState(CHALLENGE_STATUS.OPENED);
      },
      draft() {
        this.changeState(CHALLENGE_STATUS.DRAFT);
      },
    },
    OPENED: {
      close() {
        this.changeState(CHALLENGE_STATUS.CLOSED);
      },
    },
    CLOSED: {
      reopen() {
        this.changeState(CHALLENGE_STATUS.OPENED);
      },
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
  ready() {
    this.state = CHALLENGE_STATUS.PROPOSED;
    return this.state;
  },
};

const ChallengeStateMachine = Object.create(machine, {
  name: {
    writable: false,
    enumerable: true,
    value: "SolutionStateMachine",
  },
});

export default ChallengeStateMachine;
