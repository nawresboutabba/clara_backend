import { Schema, model } from 'mongoose';

const historicalIntegrants = new Schema({},{ strict: false });
export default model("HistoricalIntegrants", historicalIntegrants);