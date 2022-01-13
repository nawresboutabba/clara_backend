import { Schema } from "mongoose";
import { options } from "./interaction.base"
import InteractionBase, { InteractionBaseI } from "./interaction.base";

export interface ReactionI extends InteractionBaseI{
  type: string
}

const Reaction = InteractionBase.discriminator('Reaction',new Schema({
    type: String
  }, options));

  export default Reaction