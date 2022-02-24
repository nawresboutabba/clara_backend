import { Schema, model } from "mongoose";
import { GroupValidatorI } from "./group-validator";
import { UserI } from "./users";
import historicalIntegrants from "./historical-integrants";
import * as _ from 'lodash';


export interface IntegrantI {
    /**
     * Validator User
     */
    user: UserI,
    /**
     * committe integrant Id
     */
    integrantId: string,
    /**
     * is active?
     */
    active: boolean,
    /**
     * When was created?
     */
    created: Date,
    /**
     * Date of the last change of position in the committe. 
     * For example from LEADER to GENERAL or GENERAL to leader
     */
    lastChangePosition: Date
    /**
     * Date end
     */
    finished?: Date,
    /**
     * committe integrant can be part of group validator
     * . Just Committe integrants can be validators
     */
    groupValidator?: GroupValidatorI,
    /**
     * What is the role? Committe General or Committe Leader
     */
    role: string
    /**
     * Functions description 
     */
    functionDescription: string
}

export interface IntegrantStatusI {
    integrantId?: string,
    /**
     * exist: if the user was/is a memeber, then true.
     */
    exist: boolean,
    /**
     * active: user exist and nowaday is a member, then true
     */
    isActive: boolean,
    /**
     * role: if user exist, then has role. this field not depend on active flag
     */
    role?: string
} 

const integrant = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  integrantId: {
    type: String,
    required: true,
    unique: true
  },
  active:{
    type:Boolean,
    default: true,
    required:true
  },
  created: Date,
  updated: Date,
  lastChangePosition: Date,
  finished: Date,
  groupValidator: {
    type: Schema.Types.ObjectId,
    ref: 'GroupValidator'
  },
  role: {
    type: String,
    enum: ["LEADER", "GENERAL"]
  },
  functionDescription: String
})

integrant.post('findOneAndUpdate', async(document)=> {
  try{
    const integrant = _.omit(document.toJSON(),['_id','__v'])
    integrant.updated=new Date()
    await historicalIntegrants.create(integrant)
  }catch(error){
    console.log(`Error with log integrants changes. Document:${integrant} . Error: ${error}`)
  }
})

const integrantModel = model('Integrant', integrant);

integrantModel.watch().
/**
 * @TODO add document audit
 */
  on('change', data => console.log(new Date(), data));

export default integrantModel