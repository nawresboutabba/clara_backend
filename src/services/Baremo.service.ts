import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Baremo, { BaremoI } from "../models/baremo";
import { SolutionI } from "../models/situation.solutions";

const BaremoService = {
  async getAllBaremosBySolution(solution: SolutionI): Promise<Array<BaremoI>> {
    try{
      const baremos = await Baremo.find({
        solution: solution._id
      })
        .populate('solution')
        .populate('user')
      return baremos
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.BAREMO_GET_ALL_BY_SOLUTION,
        HTTP_RESPONSE._500,
        error
      )) 
    }
  },
}

export default BaremoService;