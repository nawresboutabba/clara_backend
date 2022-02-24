/**
 * Reference: https://gist.github.com/prof3ssorSt3v3/9eb833677b8aa05282d72f0b3c120f03
 */

const machine = {
	state: "DRAFT",
	transitions: {
		DRAFT: {
			confirm: function () {
				this.changeState("PROPOSED");
			}
		},
		PROPOSED: {
			published: function () {
				this.changeState("ANALYZING");
			}
		},
		ANALYZING: {
			build: function () {
				this.changeState("APROVED_FOR_CONSTRUCTION");
			},
			review: function () {
				this.changeState("REVIEW");
			},
			reject: function () {
				this.changeState("REJECTED");
			},
		},
		APROVED_FOR_CONSTRUCTION: {
		},
		REVIEW: {
			openeyes: function () {
				console.log("current state", this.state);
				console.log("\tTurn off the sun please");
			},
			reject: function () {
				this.changeState("REJECTED");
			}
		},
		REJECTED: {
		}
	},
	dispatch(actualStatus, actionName, ...payload) {

		const action = this.transitions[actualStatus][actionName];

		if (action) {
			action.apply(machine, ...payload);
			return this.state
		} else {
			/**
             * Combination actualState and actionName is not valid
             */
			throw "Action not found";
		}

	},
	changeState(newState) {
		//validate that newState actually exists
		this.state = newState;
	}
};

const SolutionStateMachine = Object.create(machine, {
	name: {
		writable: false,
		enumerable: true,
		value: "SolutionStateMachine"
	}
});

/**
 * Estado Actual, transicion
 */
/* try {
	const resp = Jeff.dispatch("DRAFT", "confirmo");
	console.log(resp)
	console.log(Jeff.state);
} catch (error) {
	console.log(error)
} */

export default SolutionStateMachine;