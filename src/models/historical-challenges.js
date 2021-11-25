const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalChallenge = new Schema({},{ strict: false });
module.exports = mongoose.model("HistoricalChallenge", historicalChallenge);