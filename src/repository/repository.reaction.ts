import { INTERACTION } from "../constants"

export const isReaction = async  (type:string): Promise<boolean> => {
  return new Promise((resolve, reject)=> {
    const reactions = [
      INTERACTION.REACTIONS.LIKE,
      INTERACTION.REACTIONS.DONT_UNDERTAND
    ]
    return resolve(reactions.includes(type))
  })
}