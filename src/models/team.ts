import { Schema, model } from "mongoose";
import { UserI } from "./users";

export interface TeamI {
    teamId: string,
    creator: UserI,
    members?: Array<UserI>,
    created: Date,
    name: string
}

const team = new Schema({
  teamId: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
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