import { BaremoResponse } from "../../controller/baremo";
import { BaremoI } from "../../models/baremo";
import { lightSolutionFilter } from "./solution";
import { lightUserFilter } from "./user";

export const genericBaremoFilter = async (baremo: BaremoI) : Promise<BaremoResponse> => {
  try{
    const user = await lightUserFilter(baremo.user)
    const solution = await lightSolutionFilter (baremo.solution)
    return ({
      baremo_id: baremo.baremoId,
      user,
      solution,
      created: baremo.created,
      updated: baremo.updated,
      status: baremo.status,
      type: baremo.type,
      comment: baremo.comment
    })
  }catch(error){
    return Promise.reject(error)
  }
}

export const genericArrayBaremoFilter = async (baremos: BaremoI []) : Promise<BaremoResponse []> => {
  try{
    const arrayBaremo: Array<Promise<BaremoResponse>>= []
    baremos.forEach(baremo => {
      arrayBaremo.push(genericBaremoFilter(baremo))
    })
    return await Promise.all(arrayBaremo)
      .then(result => {
        return result
      })
      .catch(error=> {
        return Promise.reject(error)
      })  
  }catch(error){
    return Promise.reject(error)
  }
}