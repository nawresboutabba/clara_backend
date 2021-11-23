const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HistoricalSolution = require("./historical-solutions");
const _ = require("lodash");

const solution = new Schema({
  solutionId: String,
  idChallenge: String,
  authorEmail: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  description: String,
  images: [
    {
      type: String,
    },
  ],
  canChooseScope: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
  status: String,
  timeInPark: {
    type: Number,
    default: null,
  },
  baremoValidator: [
    {
      type: String,
    },
  ],
  baremoReferrer: [
    {
      type: String,
    },
  ],
  calification: {
    complexity: Number,
    impact: Number,
  },
  reactions: {
    likes: Number,
    confused: Number,
  },
});

solution.statics.getSolutionActiveById = async function (id) {
  return new Promise((resolve, reject) =>
    this.findOne({
      solutionId: id,
      active: true,
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        return reject(err);
      })
  );
};

solution.methods.deactivateSolution = function () {
  (this.updated = new Date()), (this.active = false);

  return new Promise((resolve, reject) => {
    this.save()
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

solution.methods.updateWithLog = async function (update) {
  const oldData = _.omit(this.toJSON(), ["_id", "__v"]);
  update.updated = new Date();
  Object.assign(this, update);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Promise.all([
      HistoricalSolution.create([oldData], { session: session }),
      this.save({ session: session }),
    ]);
    await session.commitTransaction();
    session.endSession();
    return _.omit(this.toJSON(), ["_id", "__v"]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return error;
  }
};
module.exports = mongoose.model("Solution", solution);
