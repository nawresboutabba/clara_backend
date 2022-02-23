import { Post , Controller, Route, Body,  Path,  Get } from 'tsoa'
import { newArea, getAllAreas, getAreaById } from '../../repository/repository.area'

export interface AreaBody {
    name:string,
}

export interface AreaResponse {
    area_id: string
    name: string,
}


/**
 * Post a new area (or workspace)
 */
@Route('area')
export default class AreaController extends Controller {
    @Post()
  public async newArea(@Body() body: AreaBody):Promise<AreaResponse>{
    return newArea(body)
  }
    @Get('/:areaId')
    public async getArea(@Path('areaId') areaId: string): Promise<AreaResponse>{
      return getAreaById(areaId)
    }
    @Get()
    public async getAllAreas(): Promise<AreaResponse[]>{
      return getAllAreas()
    }
}