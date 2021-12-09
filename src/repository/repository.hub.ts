import { HubBody } from "../controller/hub";
import { HubI } from "../models/organization.hub";
import HubService from "../services/Hub.Service";
import { nanoid } from 'nanoid'

export const newHub = async(body:HubBody): Promise<HubI>=>{
    return new Promise(async (resolve, reject)=> {
        try{
            const hub = Object.assign(body,{hubId: nanoid(), active:true} )
            const resp = await HubService.newHub(hub)
            return resolve (resp)
        }catch(error){
            return reject(error)
        }

    })
}