import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { AreaI } from '../../models/organization.area';
import { newArea } from '../../repository/repository.area'

export interface AreaBody {
    name:string,
    companyId: string
}
@Route('area')
export default class AreaController extends Controller {
    @Post()
    public async newArea(@Body() body: AreaBody):Promise<AreaI>{
        return newArea(body)
    }
}