const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalSolution = new Schema(
  {
    solutionId: String,
    idChallenge: String,
    authorEmail: String,
  },
  { strict: false }
);

module.exports = mongoose.model("HistoricalSolution", historicalSolution);
