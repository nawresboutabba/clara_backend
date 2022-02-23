import { REACTIONS } from "../constants"

export const isReaction = async  (type:string): Promise<boolean> => {
  return new Promise((resolve, reject)=> {
    const reactions = [
      REACTIONS.LIKE,
      REACTIONS.DONT_UNDERTAND
    ]
    return resolve(reactions.includes(type))
  })
}