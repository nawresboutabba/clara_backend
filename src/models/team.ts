import { Schema, model } from "mongoose";

export interface TeamI {
    teamId: string,
    created: Date,
    name: string
}

const team = new Schema({
  teamId: String,
  created: Date,
  name: {
    type: Schema.Types.String,
    unique: true,
    required: true
  }
})
/**
 * @TODO check unique team name
 */
team.index({name:1},{unique:true})

export default model('Team', team);