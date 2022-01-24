import { nanoid } from "nanoid";
import { AreaBody, AreaResponse } from "../controller/area/area";
import { AreaI } from "../models/organization.area";
import AreaService from "../services/Area.service";
import { genericAreaFilter, genericArrayAreaFilter } from "../utils/field-filters/area";

export const newArea = async (body:AreaBody): Promise<AreaResponse>=> {
    return new Promise(async (resolve, reject)=> {
        try{
            const area: AreaI = {
                areaId: nanoid(),
                name : body.name
            }
            const areaNew = await AreaService.newArea(area)
            const resp = await genericAreaFilter(areaNew)
            return resolve(resp)
        }catch(error){
            return reject(error)
        }
    })
}

export const getAreaById = async (areaId: string): Promise<AreaResponse> => {
    return new Promise(async (resolve, reject)=> {
        try{
            const area = await AreaService.getAreaById(areaId)
            const resp = await genericAreaFilter(area)
            return resolve(resp)
        }catch(error){
            return reject(error)
        }
    })
}

export const getAllAreas = async (): Promise<AreaResponse[]> => {
    return new Promise(async (resolve, reject)=> {
        try{
            const area = await AreaService.getAllAreas()
            const resp = await genericArrayAreaFilter(area)
            return resolve(resp)
        }catch(error){
            return reject(error)
        }
    })
}