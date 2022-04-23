import { BAREMO_STATUS, ERRORS } from "../../constants";

const machine = {
  state: BAREMO_STATUS.ONGOING,
  transitions :{
    ONGOING: {
      confirm : function() {
        this.changeState(BAREMO_STATUS.CLOSED);
      }
    },
    CLOSED : {
      reopen: function () {
        this.changeState(BAREMO_STATUS.ONGOING);
      }
    }
  },
  dispatch(actualStatus: string, actionName: string, ...payload: any) {

    const action = this.transitions[actualStatus][actionName];

    if (action) {
      action.apply(machine, ...payload);
      return this.state
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
}

const BaremoStateMachine = Object.create(machine, {
  name: {
    writable: false,
    enumerable: true,
    value: "BaremoStateMachine"
  }
});

export default BaremoStateMachine;