import { Schema, model } from 'mongoose';
import { CompanyI } from './organizacion.companies';
import { AreaI } from './organization.area';
import { HubI } from './organization.hub';

export interface UserI {
  /**
   * Mongo Document Id
   */
  _id?: string,
  /**
   * User email
   */
  email: string,
  /**
   * Business User Id
   */
  userId: string,
  /**
   * Password encrypted
   */
  password: string,
  /**
   * user first name
   */
  firstName: string,
  /**
   * User last name
   */
  lastName: string,
  /**
   * Is the user active?
   */
  active: boolean,
  /**
   * Company visible for user
   */
  company?: Array<CompanyI>,
  /**
   * Area that is visible for user
   */
  area?: Array<AreaI>,
  /**
   * Workspace that user could be explore
   */
  workSpace: Array<string>,
  /**
   * Last user update
   */
  updated?: Date
}

const user = new Schema({
  active: Boolean,
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  userId: {
    type: String,
    require: true,
    unique: true,
  },
  password: { type: String, required: true },
  firstName: String,
  lastName: String, 
  hub:[{ 
    type: Schema.Types.ObjectId, 
    ref: 'Hub'}],
  company:[{
    type: Schema.Types.ObjectId,
    ref: 'Company'}],
  area: [{
    type: Schema.Types.ObjectId,
    ref: 'Area'
  }],
  workSpace: [
    {
      type: String,
    },
  ],
  updated: Date,
});
export default model("User", user);
