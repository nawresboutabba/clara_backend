import { Schema, model } from 'mongoose';

const historicalChallenge = new Schema({},{ strict: false });
export default model("HistoricalChallenge", historicalChallenge);