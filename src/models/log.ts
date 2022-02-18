import { model, Schema } from "mongoose";

const log  = new Schema({},{ strict: false });

export default model("Log", log);