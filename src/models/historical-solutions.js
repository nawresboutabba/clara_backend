import { Schema, model } from 'mongoose';

const historicalSolution = new Schema({},{ strict: false });

export default model("HistoricalSolution", historicalSolution);
