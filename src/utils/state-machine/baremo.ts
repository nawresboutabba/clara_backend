import { BAREMO_STATUS } from "../../constants";

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
  }
}

const BaremoStateMachine = Object.create(machine, {
  name: {
    writable: false,
    enumerable: true,
    value: "BaremoStateMachine"
  }
});

export default BaremoStateMachine;