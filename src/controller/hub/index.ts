import { Post, Controller } from 'tsoa';
import { HubI } from '../../models/organization.hub';
import { newHub } from '../../repository/repository.hub';

export interface HubBody{
    name: string
}

export default class HubController extends Controller {
    @Post()
    public async newHub(body: HubBody): Promise<HubI>{
        return newHub(body)
    }
}