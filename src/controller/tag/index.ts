import { Body, Controller, Get, Post } from "tsoa";
import { getTags, newTag } from "../../repository/repository.tags";

export interface TagBody {
    name: string,
    description: string
}

export interface TagResponse {
    tag_id:string,
    name:string,
    description:string,
}

export default class TagController extends Controller {
  @Post()
  public async newTag(@Body() tag : TagBody): Promise<TagResponse>{
    return newTag(tag)
  }
  @Get()
  public async getTags(query: any): Promise<any> {
    return getTags(query)
  }

}