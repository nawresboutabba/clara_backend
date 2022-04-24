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