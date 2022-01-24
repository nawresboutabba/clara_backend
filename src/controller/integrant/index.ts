import { Post , Controller, Route, Body, Delete , Path, Get} from 'tsoa'
import { IntegrantI } from '../../models/integrant';
import { newIntegrant , deleteIntegrant, newLeader, getGeneralMembers } from '../../repository/repository.integrants'
import { UserResponse } from '../users';

export interface IntegrantResponse {
    user: UserResponse,
    integrant_id: string, 
    active: boolean,
    created: Date,
    last_change_position: Date,
    finished?: Date,
    group_validator?: string,
    role: string 
}


/**
 * Endpoint for `Integrant` operations
 */
@Route('integrant')
export default class IntegrantController extends Controller {
    /**
     * Endpoint for add or reeplace a leader of committe.
     * The new leader have to be a `general commite` user first
     * @param userId 
     * @returns 
     */
    @Post('/leader/:integrantId')
    public async newLeader(@Path('integrantId') integrantId: string): Promise<IntegrantResponse>{
        return newLeader(integrantId)
    }
    /**
     * Endpoint used for add a new integrant to committe. 
     * User could be a new integrant or old integrant with active=false
     * @param userId user that will be converted from generator to commite (GENERAL)
     * @returns 
     */
    @Post('/general')
    public async newIntegrant(@Body() userId: string): Promise<IntegrantResponse>{
        return newIntegrant(userId)
    }
    @Get()
    public async getGeneralMembers():Promise<Array<IntegrantResponse>> {
        return getGeneralMembers()
    }
    @Delete('/general/:integrantId')
    public async deleteLeader(@Path('integrantId') integrantId: string): Promise<boolean>{
        return deleteIntegrant(integrantId)
    }
    /**
     * Return all committe: LEADER + GENERAL
     * @returns 
     */
/*     @Get()
    public async getAllCommitte(): Promise<Array<IntegrantI>>{
        return getAllCommitte()
    } */
} 