const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalSolution = new Schema({},{ strict: false });

module.exports = mongoose.model("HistoricalSolution", historicalSolution);
