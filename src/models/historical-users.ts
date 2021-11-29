import { Schema, model } from 'mongoose';

const historicalUsers = new Schema({}, { strict: false });

export default model("HistoricalUser", historicalUsers);
