import { Controller, Body, Post, Route, Path, Delete } from "tsoa";
import { CompanyI } from "../../models/organizacion.companies";
import { HubI } from "../../models/organization.hub";
import { newCompany, addToHub, pullToHub } from "../../repository/repository.company";

export interface CompanyBody {
    name: string,
    CNPJ: string,
    hub?: HubI[]
}

@Route('company')
export default class CompanyController extends Controller {
    @Post()
    public async newCompany(@Body() body:CompanyBody):Promise<CompanyI>{
        return newCompany(body)
    }
    /**
     * Endpoint for adding a company to hub. 
     * @param body company that will be added @TODO company have to get throught leader session 
     * @param hubId 
     * @returns 
     */
    @Post('/hub/:hubId')
    public async addToHub(@Body() body: any, @Path('hubId') hubId: string): Promise<CompanyI>{
        return addToHub(body.companyId, hubId)
    }
    /**
     * Endpoint for delete a company from Hub. 
     * @param body company that will be deleted @TODO company have to get throught leader session 
     * @param hubId 
     * @returns 
     */
    @Delete('/hub/:hubId')
    public async pullToHub(@Body() body: any , @Path('hubId') hubId:string): Promise<CompanyI>{
        return pullToHub (body.companyId, hubId)
    }
}