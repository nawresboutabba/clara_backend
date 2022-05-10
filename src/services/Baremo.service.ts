import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Baremo, { BaremoI } from "../models/baremo";
import { SolutionI } from "../models/situation.solutions";
import { UserI } from "../models/users";

const BaremoService = {
  async getBaremoById (baremoId: string): Promise<any>{
    try{
      const baremo = await Baremo.findOne({
        baremoId
      })
        .populate('solution')
        .populate('user')
      return baremo
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_BAREMO,
        HTTP_RESPONSE._500,
        error
      )) 
    }
  },
  async newBaremo(baremo:BaremoI): Promise<BaremoI>{
    try{
      const resp = await Baremo.create(baremo)
      return resp
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.NEW_BAREMO,
        HTTP_RESPONSE._500,
        error
      )) 
    }
  },
  async getAllBaremosBySolution(solution: SolutionI): Promise<Array<any>> {
    try{
      const baremos = await Baremo.find({
        solution: solution
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
  async getCurrentBaremoByUserAndSolution (solution: SolutionI, user: UserI ): Promise<BaremoI> {
    try{
      const baremo = await Baremo.findOne({
        solution: solution,
        user:user
      })
        .populate('user')
        .populate('solution')
      return baremo
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_BAREMO,
        HTTP_RESPONSE._500,
        error
      )) 
    }
  },
  async updateBaremo (baremo: BaremoI, update: any) : Promise<BaremoI> {
    try{
      const res = await Baremo.findOneAndUpdate({
        _id : baremo
      },{
        ...update
      },{ 
        new: true
      })
        .populate('solution')
        .populate('user')
      return res
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.UPDATE_BAREMO,
        HTTP_RESPONSE._500,
        error
      )) 
    }
  }
}

export default BaremoService;