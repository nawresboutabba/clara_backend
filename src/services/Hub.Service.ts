import { HubI } from "../models/organization.hub";
import Hub from '../models/organization.hub'

const HubService = {
    async newHub(data: HubI): Promise<HubI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const resp = await Hub.create(data)
                return resolve(resp)
            }catch(error){
                return reject(error)
            }

        })
    }
}

export default HubService